import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { addMonths } from 'date-fns';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/AuthUser';
import { ReportedPhoneService } from '../../services/reported-phone.service';
import { ReportedPhonesComponent } from './reported-phones.component';
import { genPhone, genSiret } from '../../../../test/fixtures.spec';

describe('UnregisteredComponent', () => {

  let component: ReportedPhonesComponent;
  let fixture: ComponentFixture<ReportedPhonesComponent>;
  let reportedPhoneService: ReportedPhoneService;
  let authenticationService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportedPhonesComponent
      ],
      imports: [
        ComponentsModule,
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule,
        BsDatepickerModule.forRoot(),
        HttpClientModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    defineLocale('fr', frLocale);
    authenticationService = TestBed.inject(AuthenticationService);
    authenticationService.user = of(Object.assign(new User(), { role: 'Admin' }));
    reportedPhoneService = TestBed.inject(ReportedPhoneService);
    fixture = TestBed.createComponent(ReportedPhonesComponent);
    component = fixture.componentInstance;
  });

  it('should list reportedPhones in a datatable', () => {

    spyOn(reportedPhoneService, 'fetch').and.callFake(() => of([
      { phone: genPhone(), siret: genSiret(), companyName: '', category: '', count: 1},
      { phone: genPhone(), category: '', count: 2}
    ]));

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('tbody')).not.toBeNull();
    expect(nativeElement.querySelectorAll('tbody > tr').length).toBe(2);

  });

  it('should request the API on filtering', () => {

    const reportedPhoneServiceSpy = spyOn(reportedPhoneService, 'fetch').and.callFake(() => of([
      { phone: genPhone(), siret: genSiret(), count: 1},
      { phone: genPhone(), count: 2}
    ]));

    const q = 'phone';
    const start = addMonths(new Date(), -1);
    const end = new Date();

    component.phoneFilter = q;
    component.periodFilter = [start, end];
    fixture.detectChanges();

    expect(reportedPhoneServiceSpy).toHaveBeenCalledWith('phone', start, end);

  });
});

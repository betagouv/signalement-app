import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredReportedPhonesComponent } from './unregistered-reportedPhones.component';
import { ComponentsModule } from '../../../components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { addMonths } from 'date-fns';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../model/AuthUser';
import { ReportedPhoneService } from '../../../services/reported-phone.service';
import { ReportedPhonesTabsComponent } from '../reported-phones-tabs/reported-phones-tabs.component';

describe('UnregisteredComponent', () => {

  let component: UnregisteredReportedPhonesComponent;
  let fixture: ComponentFixture<UnregisteredReportedPhonesComponent>;
  let reportedPhoneService: ReportedPhoneService;
  let authenticationService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UnregisteredReportedPhonesComponent,
        ReportedPhonesTabsComponent
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
    fixture = TestBed.createComponent(UnregisteredReportedPhonesComponent);
    component = fixture.componentInstance;
  });

  it('should list unregistered-reportedPhones reportedPhones in a datatable', () => {

    spyOn(reportedPhoneService, 'listUnregistered').and.callFake(() => of([{ phone: 'phone1.fr', count: 1}, { phone: 'phone2.fr', count: 2}]));

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('tbody')).not.toBeNull();
    expect(nativeElement.querySelectorAll('tbody > tr').length).toBe(2);

  });

  it('should request the API on filtering', () => {

    const reportedPhoneServiceSpy = spyOn(reportedPhoneService, 'listUnregistered').and.callFake(() => of([{ phone: 'phone1.fr', count: 1}, { phone: 'phone2.fr', count: 2}]));

    const q = 'phone';
    const start = addMonths(new Date(), -1);
    const end = new Date();

    component.phoneFilter = q;
    component.periodFilter = [start, end];
    fixture.detectChanges();

    expect(reportedPhoneServiceSpy).toHaveBeenCalledWith('phone', start, end);

  });
});

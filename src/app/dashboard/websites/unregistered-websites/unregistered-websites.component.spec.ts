import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredWebsitesComponent } from './unregistered-websites.component';
import { ComponentsModule } from '../../../components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { WebsiteService } from '../../../services/website.service';
import { addMonths } from 'date-fns';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';
import { WebsitesTabsComponent } from '../websites-tabs/websites-tabs.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../model/AuthUser';

describe('UnregisteredComponent', () => {

  let component: UnregisteredWebsitesComponent;
  let fixture: ComponentFixture<UnregisteredWebsitesComponent>;
  let websiteService: WebsiteService;
  let authenticationService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UnregisteredWebsitesComponent,
        WebsitesTabsComponent
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
    websiteService = TestBed.inject(WebsiteService);
    fixture = TestBed.createComponent(UnregisteredWebsitesComponent);
    component = fixture.componentInstance;
  });

  it('should list unregistered-websites websites in a datatable', () => {

    spyOn(websiteService, 'listUnregistered').and.callFake(() => of([{ host: 'host1.fr', count: 1}, { host: 'host2.fr', count: 2}]));

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('tbody')).not.toBeNull();
    expect(nativeElement.querySelectorAll('tbody > tr').length).toBe(2);

  });

  it('should request the API on filtering', () => {

    const websiteServiceSpy = spyOn(websiteService, 'listUnregistered').and.callFake(() => of([{ host: 'host1.fr', count: 1}, { host: 'host2.fr', count: 2}]));

    const q = 'host';
    const start = addMonths(new Date(), -1);
    const end = new Date();

    component.hostFilter = q;
    component.periodFilter = [start, end];
    fixture.detectChanges();

    expect(websiteServiceSpy).toHaveBeenCalledWith('host', start, end);

  });
});

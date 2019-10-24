import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailComponent } from './report-detail.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoleDirective } from '../../../../directives/app-role.directive';
import { AppPermissionDirective } from '../../../../directives/app-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../../../services/authentication.service';
import { of } from 'rxjs';
import { User } from '../../../../model/AuthUser';
import { ReportService } from '../../../../services/report.service';
import { Report } from '../../../../model/Report';
import { EventService } from '../../../../services/event.service';
import { Consumer } from '../../../../model/Consumer';
import { EventActionValues, ReportEvent } from '../../../../model/ReportEvent';

describe('ReportDetailComponent', () => {

  let component: ReportDetailComponent;
  let fixture: ComponentFixture<ReportDetailComponent>;

  let authenticationService: AuthenticationService;
  let reportService: ReportService;
  let eventService: EventService;

  const reportFixture = Object.assign(new Report(), {
    consumer: Object.assign(new Consumer(), {
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email'
    })
  });

  const answerEventFixture = Object.assign(new ReportEvent(), {
    action: {value : EventActionValues.ReportResponse},
    details: {
      responseType: 'ACCEPTED',
      consumerDetails: 'details'
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportDetailComponent,
        AppRoleDirective,
        AppPermissionDirective
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxLoadingModule,
        HttpClientModule,
        ModalModule.forRoot(),
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  describe('for a professional user', () => {

    beforeEach(() => {
      authenticationService = TestBed.get(AuthenticationService);
      authenticationService.user = of(Object.assign(new User(), {role: 'Professionnel'}));
    });

    describe('when no answer has been sent', () => {

      beforeEach(() => {
        reportService = TestBed.get(ReportService);
        spyOn(reportService, 'getReport').and.returnValue(of(reportFixture));

        eventService = TestBed.get(EventService);
        spyOn(eventService, 'getEvents').and.returnValue(of([]));

        fixture = TestBed.createComponent(ReportDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should display a button to display the answer form', () => {
        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('#answerBtn')).not.toBeNull();
        expect(nativeElement.querySelector('#proAnswerForm')).toBeNull();
      });

      it('should display the answer form when the user wants to answer', () => {
        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('#answerBtn').click();

        fixture.detectChanges();
        expect(nativeElement.querySelector('#proAnswerForm')).not.toBeNull();
      });

    });

    describe('when an answer has already been sent', () => {

      beforeEach(() => {
        reportService = TestBed.get(ReportService);
        spyOn(reportService, 'getReport').and.returnValue(of(reportFixture));

        eventService = TestBed.get(EventService);
        spyOn(eventService, 'getEvents').and.returnValue(of([answerEventFixture]));

        fixture = TestBed.createComponent(ReportDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should display the answer and not enable to add another answer', () => {
        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('#answerBtn')).toBeNull();
        expect(nativeElement.querySelector('#proAnswer')).not.toBeNull();
        expect(nativeElement.querySelector('#proAnswer').textContent
          .indexOf(answerEventFixture.details.consumerDetails)).toBeGreaterThan(-1);
      });

    });


  });


});

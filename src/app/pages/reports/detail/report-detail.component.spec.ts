import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailComponent } from './report-detail.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoleDirective } from '../../../directives/app-role/app-role.directive';
import { AppPermissionDirective } from '../../../directives/app-permission/app-permission.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../../services/authentication.service';
import { of } from 'rxjs';
import { User } from '../../../model/AuthUser';
import { ReportService } from '../../../services/report.service';
import { ReportStatus } from '../../../model/Report';
import { EventService } from '../../../services/event.service';
import { EventActionValues, ReportEvent } from '../../../model/ReportEvent';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { genReport } from '../../../../../test/fixtures.spec';

describe('ReportDetailComponent', () => {

  let component: ReportDetailComponent;
  let fixture: ComponentFixture<ReportDetailComponent>;

  let authenticationService: AuthenticationService;
  let reportService: ReportService;
  let eventService: EventService;

  const answerEventFixture = Object.assign(new ReportEvent(), {
    data: {
      action: {value : EventActionValues.ReportResponse},
      details: {
        responseType: 'ACCEPTED',
        consumerDetails: 'details'
      }
    },
    user: null
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportDetailComponent,
        AppRoleDirective,
        AppPermissionDirective,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxLoadingModule,
        HttpClientModule,
        ModalModule.forRoot(),
        RouterTestingModule,
        ComponentsModule,
        PipesModule,
      ]
    })
    .compileComponents();
  }));

  describe('for a professional user', () => {

    beforeEach(() => {
      authenticationService = TestBed.get(AuthenticationService);
      authenticationService.user = of(Object.assign(new User(), {role: 'Professionnel'}));
    });

    describe('when no answer has been sent and the report is not closed', () => {

      beforeEach(() => {
        reportService = TestBed.get(ReportService);
        spyOn(reportService, 'getReport').and.returnValue(of(
          Object.assign(genReport(), {status: ReportStatus.ToReviewedByPro})
        ));

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

    describe('when no answer has been sent and the report is closed', () => {

      beforeEach(() => {
        reportService = TestBed.get(ReportService);
        spyOn(reportService, 'getReport').and.returnValue(of(
          Object.assign(genReport(), {status: ReportStatus.ClosedForPro})
        ));

        eventService = TestBed.get(EventService);
        spyOn(eventService, 'getEvents').and.returnValue(of([]));

        fixture = TestBed.createComponent(ReportDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should not display the answer and not enable to add another answer', () => {
        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('#answerBtn')).toBeNull();
        expect(nativeElement.querySelector('#proAnswer')).toBeNull();
      });

    });

    describe('when an answer has already been sent', () => {

      beforeEach(() => {
        reportService = TestBed.get(ReportService);
        spyOn(reportService, 'getReport').and.returnValue(of(genReport()));

        eventService = TestBed.get(EventService);
        spyOn(eventService, 'getEvents').and.returnValue(of([answerEventFixture]));

        fixture = TestBed.createComponent(ReportDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should display the answer and not enable to add another answer', () => {
        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('#answerBtn')).toBeNull();
        expect(nativeElement.querySelector('#proAnswerConsumerDetails')).not.toBeNull();
        expect(nativeElement.querySelector('#proAnswerConsumerDetails').textContent
          .indexOf(answerEventFixture.data.details.consumerDetails)).toBeGreaterThan(-1);
      });

    });


  });


});

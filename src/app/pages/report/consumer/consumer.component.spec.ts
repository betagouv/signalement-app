import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerComponent } from './consumer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DraftReport, Step } from '../../../model/Report';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportPaths } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { genConsumer, genDraftReport, genSubcategory } from '../../../../../test/fixtures.spec';
import { of } from 'rxjs';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';
import { DangerousProductTag } from '../../../model/Anomaly';

describe('ConsumerComponent', () => {

  let component: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;
  let reportStorageService: ReportStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConsumerComponent,
        BreadcrumbComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: `:category/${ReportPaths.Confirmation}`, redirectTo: '' }]),
      ],
      providers: [
        ReportStorageService,
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));


  describe('case of company report when the report is transmittable to Pro', () => {

    const draftReportInProgress = Object.assign(genDraftReport(Step.Company), { employeeConsumer : false });
    let retrieveReportSpy;

    beforeEach(() => {
      reportStorageService = TestBed.inject(ReportStorageService);
      retrieveReportSpy = spyOn(reportStorageService, 'retrieveReportInProgress')
        .and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));

      fixture = TestBed.createComponent(ConsumerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('ngOnInit function', () => {

      it('should initially display the form and no errors message', () => {
        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('form')).not.toBeNull();
        expect(nativeElement.querySelector('.notification.error')).toBeNull();
      });

      it('should define all form controls', () => {
        expect(component.consumerForm.controls['firstName']).toEqual(component.firstNameCtrl);
        expect(component.consumerForm.controls['lastName']).toEqual(component.lastNameCtrl);
        expect(component.consumerForm.controls['email']).toEqual(component.emailCtrl);
        expect(component.consumerForm.controls['contactAgreement']).toEqual(component.contactAgreementCtrl);
      });

      it('should initialize the inputs with empty values when there is no initial value', () => {
        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('input[formControlName="firstName"]').value).toEqual('');
        expect(nativeElement.querySelector('input[formControlName="lastName"]').value).toEqual('');
        expect(nativeElement.querySelector('input[formControlName="email"]').value).toEqual('');
        expect(nativeElement.querySelector('input[type="radio"]#contactAgreementTrue').checked).toBeFalsy();
        expect(nativeElement.querySelector('input[type="radio"]#contactAgreementFalse').checked).toBeFalsy();
      });

      it('should initialize the details inputs with initial value when it exists', () => {
        const draftReportWithConsumer = Object.assign(genDraftReport(Step.Consumer), { employeeConsumer : false });
        retrieveReportSpy.and.returnValue(of(Object.assign(new DraftReport(), draftReportWithConsumer)));

        component.ngOnInit();
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('input[formControlName="firstName"]').value).toEqual(draftReportWithConsumer.consumer.firstName);
        expect(nativeElement.querySelector('input[formControlName="lastName"]').value).toEqual(draftReportWithConsumer.consumer.lastName);
        expect(nativeElement.querySelector('input[formControlName="email"]').value).toEqual(draftReportWithConsumer.consumer.email);
        if (draftReportWithConsumer.contactAgreement) {
          expect(nativeElement.querySelector('input[type="radio"]#contactAgreementTrue').checked).toBeTruthy();
          expect(nativeElement.querySelector('input[type="radio"]#contactAgreementFalse').checked).toBeFalsy();
        } else {
          expect(nativeElement.querySelector('input[type="radio"]#contactAgreementTrue').checked).toBeFalsy();
          expect(nativeElement.querySelector('input[type="radio"]#contactAgreementFalse').checked).toBeTruthy();
        }
      });
    });

    describe('submitConsumerForm function', () => {

      it('should display errors when occurs', () => {
        component.firstNameCtrl.setValue('');
        component.lastNameCtrl.setValue('');
        component.emailCtrl.setValue('');
        component.contactAgreementCtrl.setValue(null);

        component.submitConsumerForm();
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        expect(component.showErrors).toBeTruthy();
        expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
      });

      it('should change the shared report with a report where consumer contains form inputs when no errors', () => {

        const consumer = genConsumer();
        const anomalyDate = new Date();
        component.firstNameCtrl.setValue(consumer.firstName);
        component.lastNameCtrl.setValue(consumer.lastName);
        component.emailCtrl.setValue(consumer.email);
        component.contactAgreementCtrl.setValue(true);
        const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('button#submitConsumerForm').click();
        fixture.detectChanges();

        const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
          consumer: consumer,
          contactAgreement: true
        });

        expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Consumer);

      });
    });
  });

  describe('case of the consumer is an employee', () => {

    const draftReportInProgress = Object.assign(genDraftReport(Step.Company), {employeeConsumer: true});

    beforeEach(() => {
      reportStorageService = TestBed.inject(ReportStorageService);
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));

      fixture = TestBed.createComponent(ConsumerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should define all form controls except contactAgreement', () => {
      expect(component.consumerForm.controls['firstName']).toEqual(component.firstNameCtrl);
      expect(component.consumerForm.controls['lastName']).toEqual(component.lastNameCtrl);
      expect(component.consumerForm.controls['email']).toEqual(component.emailCtrl);
      expect(component.consumerForm.contains('contactAgreement')).toBeFalsy();
    });

  });

  describe('case of the report which concerns a dangerous product', () => {

    const draftReportInProgress = Object.assign(
      genDraftReport(Step.Company),
      {
        employeeConsumer: false,
        subcategories: [{
          ...genSubcategory(),
          tags: [DangerousProductTag]
        }]
      });

    beforeEach(() => {
      reportStorageService = TestBed.inject(ReportStorageService);
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));

      fixture = TestBed.createComponent(ConsumerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should define all form controls except contactAgreement', () => {
      expect(component.consumerForm.controls['firstName']).toEqual(component.firstNameCtrl);
      expect(component.consumerForm.controls['lastName']).toEqual(component.lastNameCtrl);
      expect(component.consumerForm.controls['email']).toEqual(component.emailCtrl);
      expect(component.consumerForm.contains('contactAgreement')).toBeFalsy();
    });

  });
});

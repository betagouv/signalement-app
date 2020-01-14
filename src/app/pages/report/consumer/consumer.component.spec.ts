import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerComponent } from './consumer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';
import { Report, Step } from '../../../model/Report';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportPaths } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { AutofocusDirective } from '../../../directives/auto-focus.directive';

describe('ConsumerComponent', () => {

  let component: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;
  let reportStorageService: ReportStorageService;

  const consumerFixture = new Consumer();
  consumerFixture.firstName = 'Prénom';
  consumerFixture.lastName = 'Nom';
  consumerFixture.email = 'test@gmail.com';
  const contactAgreementFixture = true;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConsumerComponent,
        BreadcrumbComponent,
        AutofocusDirective,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: ReportPaths.Confirmation, redirectTo: '' }]),
        Angulartics2RouterlessModule.forRoot(),
      ],
      providers: [
        ReportStorageService,
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));


  describe('case of the consumer is not an employee', () => {
    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      reportStorageService.changeReportInProgress(Object.assign(new Report(), { employeeConsumer : false }));

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

      it('should not define contactAgreement form controls when the consumer is an employee', () => {
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
        const reportWithConsumer = new Report();
        reportWithConsumer.consumer = consumerFixture;
        reportWithConsumer.contactAgreement = contactAgreementFixture;
        reportStorageService.changeReportInProgress(reportWithConsumer);

        component.ngOnInit();
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        expect(nativeElement.querySelector('input[formControlName="firstName"]').value).toEqual(consumerFixture.firstName);
        expect(nativeElement.querySelector('input[formControlName="lastName"]').value).toEqual(consumerFixture.lastName);
        expect(nativeElement.querySelector('input[formControlName="email"]').value).toEqual(consumerFixture.email);
        if (contactAgreementFixture) {
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

        const anomalyDate = new Date();
        component.firstNameCtrl.setValue(consumerFixture.firstName);
        component.lastNameCtrl.setValue(consumerFixture.lastName);
        component.emailCtrl.setValue(consumerFixture.email);
        component.contactAgreementCtrl.setValue(contactAgreementFixture);
        const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('button#submitConsumerForm').click();
        fixture.detectChanges();

        const reportExpected = Object.assign(new Report(), {
          consumer: consumerFixture,
          contactAgreement: contactAgreementFixture,
          employeeConsumer: false
        });

        expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Consumer);

      });
    });
  });



  describe('case of the consumer is an employee', () => {
    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      reportStorageService.changeReportInProgress(Object.assign(new Report(), { employeeConsumer : true }));

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

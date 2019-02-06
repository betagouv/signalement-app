import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerComponent } from './consumer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';
import { Report } from '../../../model/Report';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { ReportService, Step } from '../../../services/report.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('ConsumerComponent', () => {

  let component: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;
  let reportService: ReportService;

  const consumerFixture = new Consumer();
  consumerFixture.firstName = 'Prénom';
  consumerFixture.lastName = 'Nom';
  consumerFixture.email = 'test@gmail.com';

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
        RouterTestingModule,
        Angulartics2RouterlessModule.forRoot(),
      ],
      providers: [
        ReportService,
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    reportService = TestBed.get(ReportService);
    reportService.currentReport = of(new Report());

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
    });

    it('should initialize the inputs with empty values when there is no initial value', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('input[formControlName="firstName"]').value).toEqual('');
      expect(nativeElement.querySelector('input[formControlName="lastName"]').value).toEqual('');
      expect(nativeElement.querySelector('input[formControlName="email"]').value).toEqual('');
    });

    it('should initialize the details inputs with initial value when it exists', () => {
      const reportWithConsumer = new Report();
      reportWithConsumer.consumer = consumerFixture;
      reportService.currentReport = of(reportWithConsumer);

      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('input[formControlName="firstName"]').value).toEqual(consumerFixture.firstName);
      expect(nativeElement.querySelector('input[formControlName="lastName"]').value).toEqual(consumerFixture.lastName);
      expect(nativeElement.querySelector('input[formControlName="email"]').value).toEqual(consumerFixture.email);
    });
  });

  describe('submitConsumerForm function', () => {

    it('should display errors when occurs', () => {
      component.firstNameCtrl.setValue('');
      component.lastNameCtrl.setValue('');
      component.emailCtrl.setValue('');

      component.submitConsumerForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it ('should change the shared report with a report where consumer contains form inputs when no errors', () => {

      const anomalyDate = new Date();
      component.firstNameCtrl.setValue('Prénom');
      component.lastNameCtrl.setValue('Nom');
      component.emailCtrl.setValue('test@gmail.com');
      const changeReportSpy = spyOn(reportService, 'changeReport');

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitConsumerForm').click();
      fixture.detectChanges();

      const consumerExpected = new Consumer();
      consumerExpected.firstName = 'Prénom';
      consumerExpected.lastName = 'Nom';
      consumerExpected.email = 'test@gmail.com';
      const reportExpected = new Report();
      reportExpected.consumer = consumerExpected;

      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Consumer);

    });
  });
});

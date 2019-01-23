import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntoxicationAlimentaire, ReportComponent, Step } from './report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnomalyService } from '../../services/anomaly.service';
import { Anomaly } from '../../model/Anomaly';
import { of } from 'rxjs';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';
import { ReportService } from '../../services/report.service';
import { ServiceUtils } from '../../services/service.utils';
import { FileInputComponent } from '../../components/file-input/file-input.component';
import { Component } from '@angular/core';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DetailsComponent } from './details/details.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { PrecisionComponent } from './precision/precision.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';


describe('ReportComponent', () => {

  @Component({
    selector: 'app-company',
    template: ''
  })
  class CompanyFormComponent {}

  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let anomalyService: AnomalyService;
  let reportService: ReportService;

  const precisionList1 = [
    { title: 'title11', description: 'description11' },
    { title: 'title12', description: 'description12' },
  ];
  const precisionList2 = [
    { title: 'title21', description: 'description21' },
    { title: 'title22', description: 'description22' },
    { title: 'title23', description: 'description23' },
  ];
  const anomaly1 = deserialize(Anomaly, {category: 'category1', precisionList: precisionList1});
  const anomaly2 = deserialize(Anomaly, {category: 'category2', precisionList: precisionList2});
  const anomalyIntoxicationAlimentaire = deserialize(Anomaly, {category: IntoxicationAlimentaire, precisionList: []});

  const anomaliesFixture = [anomaly1, anomaly2];

  const anomalyInfosFixture = [
    { key: 'Etablissement hors périmètre', title: '', info: 'infoHP' },
    { key: precisionList2[0], title: 'title220', info: 'info220' },
    { key: precisionList2[2], title: 'title222', info: 'info222' },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportComponent,
        FileInputComponent,
        CompanyFormComponent,
        BreadcrumbComponent,
        DetailsComponent,
        ConsumerComponent,
        PrecisionComponent,
        ConfirmationComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BsDatepickerModule.forRoot(),
        NgxLoadingModule,
        Angulartics2RouterlessModule.forRoot(),
      ],
      providers: [
        AnomalyService,
        ReportService,
        ServiceUtils,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    anomalyService = TestBed.get(AnomalyService);
    reportService = TestBed.get(ReportService);
    spyOn(anomalyService, 'getAnomalies').and.returnValue(of(anomaliesFixture));
    spyOn(anomalyService, 'getAnomalyInfos').and.returnValue(of(anomalyInfosFixture));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit function', () => {

    it('should load anomaly list and route to the first step', () => {
      component.ngOnInit();

      expect(anomalyService.getAnomalies).toHaveBeenCalled();
      expect(component.anomalies).toEqual(anomaliesFixture);
      expect(component.step).toEqual(Step.Category);
    });
  });

  describe('first step (category)', () => {

    it('should display category blocks', () => {
      component.step = Step.Category;
      component.anomalies = anomaliesFixture;
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('div.category').length).toEqual(anomaliesFixture.length);
    });

    it('should initiate a report and route to precision step when a category is clicked', () => {
      component.step = Step.Category;
      component.anomalies = anomaliesFixture;
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('div.category').click();

      expect(component.report).not.toBeNull();
      expect(component.report.anomalyCategory).toEqual(anomaly1.category);
      expect(component.step).toEqual(Step.Precision);
    });

  });

/*
  describe('template design', () => {
    it('should display a select input for companyType on init', () => {
      component.ngOnInit();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="companyType"]')).not.toBeNull();
    });

    it('should display companyType of anomalies as options of companyType select plus an option "Autres"', () => {
      component.anomalies = anomaliesFixture;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('select[formcontrolname="companyType"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="companyType"] option[value="Autres"')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="companyType"] option').length)
        .toBe(anomaliesFixture.length + 2);
    });

    it('should not display a select input for anomalyType on init', () => {
      component.ngOnInit();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="anomalyType"]')).toBeNull();
    });

    it('should display a select input for anomalyCategory with anomalyCategory list as options ' +
      'when associated form control is defined', () => {

      component.reportForm.addControl('anomalyCategory', component.anomalyCategoryCtrl);
      component.anomalyTypeList = anomalyList1;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="anomalyCategory"]')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="anomalyCategory"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="anomalyCategory"] option').length)
        .toBe(anomalyList1.length + 1);
    });

    it('should not display a select input for anomalyPrecision on init', () => {
      component.ngOnInit();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="anomalyPrecision"]')).toBeNull();
    });

    it('should display a select input for anomalyPrecision with anomalyPrecision list as options ' +
      'when associated form control is defined', () => {

      component.reportForm.addControl('anomalyPrecision', component.anomalyPrecisionCtrl);
      component.anomalyPrecisionList = precisionList22;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="anomalyPrecision"]')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="anomalyPrecision"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="anomalyPrecision"] option').length)
        .toBe(precisionList22.length + 1);
    });

    it('should not display errors when the form is not submitted', () => {
      component.companyTypeCtrl.setValue('');

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('.invalid')).toBeNull();
    });

    it('should display errors when the form is submitted', () => {
      component.companyTypeCtrl.setValue('');

      component.createReport();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('.invalid')).not.toBeNull();
    });

    it('should initially display the form', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
    });

    it('should not display the form when succeed', () => {
      component.showSuccess = true;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).toBeNull();
    });

  });

  describe('ngOnInit function', () => {

    it('should load anomaly list and anomaly info list', () => {
      component.ngOnInit();

      expect(anomalyService.getAnomalies).toHaveBeenCalled();
      expect(component.anomalies).toEqual(anomaliesFixture);
      expect(component.anomalyInfos).toEqual(anomalyInfosFixture);
    });

    it('should set all form controls except for anomalyType and anomalyPrecision', () => {
      component.ngOnInit();

      expect(component.reportForm.controls['firstName']).toBeDefined();
      expect(component.reportForm.controls['lastName']).toBeDefined();
      expect(component.reportForm.controls['email']).toBeDefined();
      expect(component.reportForm.controls['contactAgreement']).toBeDefined();
      expect(component.reportForm.controls['anomalyType']).toBeUndefined();
      expect(component.reportForm.controls['anomalyPrecision']).toBeUndefined();
    });

    it('should not display form errors', () => {
      component.ngOnInit();

      expect(component.showErrors).toBeFalsy();
    });

  });

  describe('changeCompanyType function', () => {

    it('should load anomalyType list for selected companyType and add a form control for anomalyType', () => {
      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);

      component.changeCompanyType();

      expect(component.anomalyTypeList).toEqual(anomalyTypeListForEtablissement2);
      expect(component.reportForm.controls['anomalyType']).not.toBeNull();
    });

    it('should display an information message when then option "Autres" is selected', () => {
      component.anomalies = anomaliesFixture;
      component.anomalyInfos = anomalyInfosFixture;
      component.companyTypeCtrl.setValue('Autres');

      component.changeCompanyType();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('div.success')).not.toBeNull();
    });

  });

  describe('selectAnomalyCategory function', () => {

    it('should reset anomalyPrecision list and delete anomalyPrecision form control when no typeAnomaly is selected', () => {
      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);
      component.anomalyCategoryCtrl.setValue('');

      component.selectAnomalyCategory();

      expect(component.anomalyPrecisionList).toEqual([]);
      expect(component.reportForm.controls['anomalyPrecision']).toBeUndefined();
    });

    it('should load anomalyPrecision list for selected companyType and anomalyType', () => {

      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);
      component.anomalyCategoryCtrl.setValue(anomalyType22.category);

      component.selectAnomalyCategory();

      expect(component.anomalyPrecisionList).toEqual(precisionList22);
    });

    it('should add a form control for anomalyPrecision if loaded list is not empty', () => {

      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);
      component.anomalyCategoryCtrl.setValue(anomalyType22.category);

      component.selectAnomalyCategory();

      expect(component.anomalyPrecisionList).toEqual(precisionList22);
      expect(component.reportForm.controls['anomalyPrecision']).not.toBeNull();
    });

    it('should not add a form control for anomalyPrecision if loaded list is empty', () => {

      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);
      component.anomalyCategoryCtrl.setValue(anomalyType21.category);

      component.selectAnomalyCategory();

      expect(component.reportForm.controls['anomalyPrecision']).toBeUndefined();
    });
  });

  describe('createReport function', () => {

    it('should display errors when form is invalid', () => {
      component.companyTypeCtrl.setValue('');

      component.createReport();

      expect(component.showErrors).toBeTruthy();
    });

    it('should call a creation service with a report object', () => {
      const anomalyDate = new Date();
      const anomalyFile = new File([], 'anomaly.jpg');
      component.companyTypeCtrl.setValue('companyType');
      component.anomalyCategoryCtrl.setValue('category');
      component.anomalyPrecisionCtrl.setValue('precision');
      component.anomalyDateCtrl.setValue(anomalyDate);
      component.anomalyTimeSlotCtrl.setValue(5);
      component.lastNameCtrl.setValue('lastName');
      component.firstNameCtrl.setValue('firstName');
      component.emailCtrl.setValue('email@mail.fr');
      component.contactAgreementCtrl.setValue(true);
      component.anomalyFile = anomalyFile;
      component.companyCtrl.setValue(Object.assign(
        new Company(),
        {
          name: 'Mon établissement',
          line1: 'adresse 1',
          line3: 'adresse 3',
          line4: 'adresse 4',
          siret: '123245678900015',
          postalCode: '87270'
        }
      ));

      spyOn(reportService, 'createReport').and.returnValue(of());

      component.createReport();
      const report = new Report();
      report.companyType = 'companyType';
      report.anomalyCategory = 'category';
      report.anomalyPrecision = 'precision';
      report.companyName = 'Mon établissement';
      report.companyAddress = 'adresse 1 - adresse 3 - adresse 4';
      report.companySiret = '123245678900015';
      report.companyPostalCode = '87270';
      report.description = '';
      report.anomalyDate = anomalyDate;
      report.anomalyTimeSlot = 5;
      report.lastName = 'lastName';
      report.firstName = 'firstName';
      report.email = 'email@mail.fr';
      report.contactAgreement = true;
      report.ticketFile = undefined;
      report.anomalyFile = anomalyFile;
      expect(reportService.createReport).toHaveBeenCalledWith(report);
    });

    it('should display a success message when report creation succeed', (done) => {
      component.companyTypeCtrl.setValue('companyType');
      component.companyCtrl.setValue(new Company());
      component.anomalyDateCtrl.setValue(new Date());
      component.lastNameCtrl.setValue('lastName');
      component.firstNameCtrl.setValue('firstName');
      component.emailCtrl.setValue('email@mail.fr');
      const reportServiceSpy = spyOn(reportService, 'createReport').and.returnValue(of(new Report()));

      component.createReport();
      reportServiceSpy.calls.mostRecent().returnValue.subscribe(() => {
        expect(component.showSuccess).toBeTruthy();
        done();
      });

    });

  });

  describe('case of intoxication alimentaire', () => {

    it('should display a specific label for the submit button', () => {

      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);
      component.anomalyCategoryCtrl.setValue(anomalyTypeIntoxicationAlimentaire.category);

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('button[type="submit"].btn-primary').textContent.trim()).toBe('Suivant');

    });

  });

  describe('case of anomaly which do not require a report', () => {

    it('should display an information message when there is an anomaly info linked to the anomaly', () => {

      component.ngOnInit();
      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);
      component.anomalyCategoryCtrl.setValue(anomalyType22.category);
      component.anomalyPrecisionCtrl.setValue(precisionList22[0]);

      component.selectAnomalyPrecision();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('.notification')).not.toBeNull();
    });

  });

  describe('case of the user want to make another report link to the first one', () => {

    it('should display the report form with invariable inputs already filled', () => {

      const anomalyDate = new Date();
      const anomalyFile = new File([], 'anomaly.jpg');
      component.companyTypeCtrl.setValue('companyType');
      component.anomalyCategoryCtrl.setValue('category');
      component.anomalyPrecisionCtrl.setValue('precision');
      component.anomalyDateCtrl.setValue(anomalyDate);
      component.anomalyTimeSlotCtrl.setValue(5);
      component.lastNameCtrl.setValue('lastName');
      component.firstNameCtrl.setValue('firstName');
      component.emailCtrl.setValue('email@mail.fr');
      component.contactAgreementCtrl.setValue(true);
      component.anomalyFile = anomalyFile;
      component.descriptionCtrl.setValue('description');
      component.companyCtrl.setValue(Object.assign(
        new Company(),
        {
          name: 'Mon établissement',
          line1: 'adresse 1',
          line3: 'adresse 3',
          line4: 'adresse 4',
          siret: '123245678900015',
          postalCode: '87270'
        }
      ));
      component.showSuccess = true;

      component.addNewReport();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(component.reportForm.controls['anomalyDate'].value).toEqual(anomalyDate);
      expect(component.reportForm.controls['anomalyTimeSlot'].value).toEqual(5);
      expect(component.reportForm.controls['firstName'].value).toEqual('firstName');
      expect(component.reportForm.controls['lastName'].value).toEqual('lastName');
      expect(component.reportForm.controls['email'].value).toEqual('email@mail.fr');
      expect(component.reportForm.controls['contactAgreement'].value).toEqual(true);
      expect(component.reportForm.controls['companyType'].value).toEqual('companyType');
      expect(component.reportForm.controls['description'].value).toEqual('');
      expect(component.reportForm.controls['anomalyCategory'].value).toEqual('');
      expect(component.reportForm.controls['anomalyPrecision']).toBeUndefined();
    });

  });*/
});

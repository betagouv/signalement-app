import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntoxicationAlimentaire, ReportingComponent, Step } from './reporting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnomalyService } from '../../services/anomaly.service';
import { Anomaly } from '../../model/Anomaly';
import { of } from 'rxjs';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';
import { ReportingService } from '../../services/reporting.service';
import { Reporting } from '../../model/Reporting';
import { ServiceUtils } from '../../services/service.utils';
import { BsDatepickerModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { FileInputComponent } from '../../components/file-input/file-input.component';
import { Component } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';


describe('ReportingFormComponent', () => {

  @Component({
    selector: 'app-company',
    template: ''
  })
  class CompanyFormComponent {}

  let component: ReportingComponent;
  let fixture: ComponentFixture<ReportingComponent>;
  let anomalyService: AnomalyService;
  let reportingService: ReportingService;

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
    defineLocale('fr', frLocale);
    TestBed.configureTestingModule({
      declarations: [
        ReportingComponent,
        FileInputComponent,
        CompanyFormComponent
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
        ReportingService,
        ServiceUtils,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    anomalyService = TestBed.get(AnomalyService);
    reportingService = TestBed.get(ReportingService);
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

    it('should initiate a reporting and route to precision step when a category is clicked', () => {
      component.step = Step.Category;
      component.anomalies = anomaliesFixture;
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('div.category').click();

      expect(component.reporting).not.toBeNull();
      expect(component.reporting.anomalyCategory).toEqual(anomaly1.category);
      expect(component.anomalyPrecisionList).toEqual(anomaly1.precisionList);
      expect(component.step).toEqual(Step.Precision);
    });

  });


  describe('second step (precisions)', () => {

    it('should display the precisions as radio buttons list', () => {
      component.step = Step.Precision;
      component.anomalyPrecisionList = anomaly2.precisionList;
      component.reporting = Object.assign(new Reporting(), { anomalyCategory: anomaly2.category });
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('input[type="radio"]').length).toEqual(anomaly2.precisionList.length);
    });

    it('should set the precision and route to description step when a precision is selected on submit', () => {
      component.step = Step.Precision;
      component.anomalyPrecisionList = anomaly2.precisionList;
      component.reporting = Object.assign(new Reporting(), { anomalyCategory: anomaly2.category });
      component.anomalyPrecisionCtrl.setValue(anomaly2.precisionList[0].title);
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();

      expect(component.reporting.anomalyPrecision).toEqual(anomaly2.precisionList[0].title);
      expect(component.step).toEqual(Step.Description);
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

      component.reportingForm.addControl('anomalyCategory', component.anomalyCategoryCtrl);
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

      component.reportingForm.addControl('anomalyPrecision', component.anomalyPrecisionCtrl);
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

      component.createReporting();
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

      expect(component.reportingForm.controls['anomalyDate']).toBeDefined();
      expect(component.reportingForm.controls['anomalyTimeSlot']).toBeDefined();
      expect(component.reportingForm.controls['description']).toBeDefined();
      expect(component.reportingForm.controls['firstName']).toBeDefined();
      expect(component.reportingForm.controls['lastName']).toBeDefined();
      expect(component.reportingForm.controls['email']).toBeDefined();
      expect(component.reportingForm.controls['contactAgreement']).toBeDefined();
      expect(component.reportingForm.controls['anomalyType']).toBeUndefined();
      expect(component.reportingForm.controls['anomalyPrecision']).toBeUndefined();
    });

    it('should not display form errors', () => {
      component.ngOnInit();

      expect(component.showErrors).toBeFalsy();
    });

    it ('should define the plageHoraireList to display', () => {
      component.ngOnInit();

      expect(component.plageHoraireList).toBeDefined();
      expect(component.plageHoraireList.length).toBe(24);
    });

  });

  describe('changeCompanyType function', () => {

    it('should load anomalyType list for selected companyType and add a form control for anomalyType', () => {
      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);

      component.changeCompanyType();

      expect(component.anomalyTypeList).toEqual(anomalyTypeListForEtablissement2);
      expect(component.reportingForm.controls['anomalyType']).not.toBeNull();
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
      expect(component.reportingForm.controls['anomalyPrecision']).toBeUndefined();
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
      expect(component.reportingForm.controls['anomalyPrecision']).not.toBeNull();
    });

    it('should not add a form control for anomalyPrecision if loaded list is empty', () => {

      component.anomalies = anomaliesFixture;
      component.companyTypeCtrl.setValue(companyType2);
      component.anomalyCategoryCtrl.setValue(anomalyType21.category);

      component.selectAnomalyCategory();

      expect(component.reportingForm.controls['anomalyPrecision']).toBeUndefined();
    });
  });

  describe('createReporting function', () => {

    it('should display errors when form is invalid', () => {
      component.companyTypeCtrl.setValue('');

      component.createReporting();

      expect(component.showErrors).toBeTruthy();
    });

    it('should call a creation service with a reporting object', () => {
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

      spyOn(reportingService, 'createReporting').and.returnValue(of());

      component.createReporting();
      const reporting = new Reporting();
      reporting.companyType = 'companyType';
      reporting.anomalyCategory = 'category';
      reporting.anomalyPrecision = 'precision';
      reporting.companyName = 'Mon établissement';
      reporting.companyAddress = 'adresse 1 - adresse 3 - adresse 4';
      reporting.companySiret = '123245678900015';
      reporting.companyPostalCode = '87270';
      reporting.description = '';
      reporting.anomalyDate = anomalyDate;
      reporting.anomalyTimeSlot = 5;
      reporting.lastName = 'lastName';
      reporting.firstName = 'firstName';
      reporting.email = 'email@mail.fr';
      reporting.contactAgreement = true;
      reporting.ticketFile = undefined;
      reporting.anomalyFile = anomalyFile;
      expect(reportingService.createReporting).toHaveBeenCalledWith(reporting);
    });

    it('should display a success message when reporting creation succeed', (done) => {
      component.companyTypeCtrl.setValue('companyType');
      component.companyCtrl.setValue(new Company());
      component.anomalyDateCtrl.setValue(new Date());
      component.lastNameCtrl.setValue('lastName');
      component.firstNameCtrl.setValue('firstName');
      component.emailCtrl.setValue('email@mail.fr');
      const reportingServiceSpy = spyOn(reportingService, 'createReporting').and.returnValue(of(new Reporting()));

      component.createReporting();
      reportingServiceSpy.calls.mostRecent().returnValue.subscribe(() => {
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

  describe('case of anomaly which do not require a reporting', () => {

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

  describe('case of the user want to make another reporting link to the first one', () => {

    it('should display the reporting form with invariable inputs already filled', () => {

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

      component.addNewReporting();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(component.reportingForm.controls['anomalyDate'].value).toEqual(anomalyDate);
      expect(component.reportingForm.controls['anomalyTimeSlot'].value).toEqual(5);
      expect(component.reportingForm.controls['firstName'].value).toEqual('firstName');
      expect(component.reportingForm.controls['lastName'].value).toEqual('lastName');
      expect(component.reportingForm.controls['email'].value).toEqual('email@mail.fr');
      expect(component.reportingForm.controls['contactAgreement'].value).toEqual(true);
      expect(component.reportingForm.controls['companyType'].value).toEqual('companyType');
      expect(component.reportingForm.controls['description'].value).toEqual('');
      expect(component.reportingForm.controls['anomalyCategory'].value).toEqual('');
      expect(component.reportingForm.controls['anomalyPrecision']).toBeUndefined();
    });

  });*/
});

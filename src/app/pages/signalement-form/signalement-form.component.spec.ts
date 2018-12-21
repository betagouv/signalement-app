import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntoxicationAlimentaire, SignalementFormComponent } from './signalement-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnomalyService } from '../../services/anomaly.service';
import { Anomaly, AnomalyType } from '../../model/Anomaly';
import { of } from 'rxjs';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';
import { SignalementService } from '../../services/signalement.service';
import { Signalement } from '../../model/Signalement';
import { ServiceUtils } from '../../services/service.utils';
import { BsDatepickerModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { FileInputComponent } from '../../components/file-input/file-input.component';
import { Company } from '../../model/Company';
import { Component } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';


describe('SignalementFormComponent', () => {

  @Component({
    selector: 'app-company-form',
    template: ''
  })
  class CompanyFormComponent {}

  let component: SignalementFormComponent;
  let fixture: ComponentFixture<SignalementFormComponent>;
  let anomalyService: AnomalyService;
  let signalementService: SignalementService;

  const typeEtablissement1 = 'typeEtablissement1';
  const typeAnomalieListEtablissement1 = [
    deserialize(AnomalyType, {category: 'typeAnomalie11'}),
    deserialize(AnomalyType, {category: 'typeAnomalie12'})
  ];
  const typeEtablissement2 = 'typeEtablissement2';
  const precisionList22 = ['precision221', 'precision222', 'precision2223'];
  const typeAnomalie21 = deserialize(AnomalyType, {category: 'typeAnomalie21', precisionList: []});
  const typeAnomalie22 = deserialize(AnomalyType, {category: 'typeAnomalie22', precisionList: precisionList22});
  const typeAnomalieIntoxicationAlimentaire = deserialize(AnomalyType, {category: IntoxicationAlimentaire, precisionList: []});
  const typeAnomalieListEtablissement2 = [
    typeAnomalie21,
    typeAnomalie22,
    typeAnomalieIntoxicationAlimentaire
  ];

  const anomaliesFixture = [
    deserialize(Anomaly, {companyType: typeEtablissement1, anomalyTypeList: typeAnomalieListEtablissement1}),
    deserialize(Anomaly, {companyType: typeEtablissement2, anomalyTypeList: typeAnomalieListEtablissement2}),
  ];

  const anomalyInfosFixture = [
    { key: precisionList22[0], info: 'info220' },
    { key: precisionList22[2], info: 'info222' },
  ]

  beforeEach(async(() => {
    defineLocale('fr', frLocale);
    TestBed.configureTestingModule({
      declarations: [
        SignalementFormComponent,
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
        SignalementService,
        ServiceUtils,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    anomalyService = TestBed.get(AnomalyService);
    signalementService = TestBed.get(SignalementService);
    spyOn(anomalyService, 'getAnomalies').and.returnValue(of(anomaliesFixture));
    spyOn(anomalyService, 'getAnomalyInfos').and.returnValue(of(anomalyInfosFixture));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template design', () => {
    it('should display a select input for typeEtablissement on init', () => {
      component.ngOnInit();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="typeEtablissement"]')).not.toBeNull();
    });

    it('should display typeEtablissement of anomalies as options of typeEtablissement select', () => {
      component.anomalies = anomaliesFixture;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('select[formcontrolname="typeEtablissement"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="typeEtablissement"] option').length)
        .toBe(anomaliesFixture.length + 1);
    });

    it('should not display a select input for anomalyType on init', () => {
      component.ngOnInit();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="anomalyType"]')).toBeNull();
    });

    it('should display a select input for anomalyCategory with anomalyCategory list as options ' +
      'when associated form control is defined', () => {

      component.signalementForm.addControl('anomalyCategory', component.anomalyCategoryCtrl);
      component.anomalyTypeList = typeAnomalieListEtablissement1;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="anomalyCategory"]')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="anomalyCategory"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="anomalyCategory"] option').length)
        .toBe(typeAnomalieListEtablissement1.length + 1);
    });

    it('should not display a select input for anomalyPrecision on init', () => {
      component.ngOnInit();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="anomalyPrecision"]')).toBeNull();
    });

    it('should display a select input for anomalyPrecision with anomalyPrecision list as options ' +
      'when associated form control is defined', () => {

      component.signalementForm.addControl('anomalyPrecision', component.anomalyPrecisionCtrl);
      component.anomalyPrecisionList = precisionList22;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="anomalyPrecision"]')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="anomalyPrecision"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="anomalyPrecision"] option').length)
        .toBe(precisionList22.length + 1);
    });

    it('should not display errors when the form is not submitted', () => {
      component.typeEtablissementCtrl.setValue('');

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('.invalid')).toBeNull();
    });

    it('should display errors when the form is submitted', () => {
      component.typeEtablissementCtrl.setValue('');

      component.createSignalement();
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

      expect(component.signalementForm.controls['dateConstat']).toBeDefined();
      expect(component.signalementForm.controls['heureConstat']).toBeDefined();
      expect(component.signalementForm.controls['description']).toBeDefined();
      expect(component.signalementForm.controls['prenom']).toBeDefined();
      expect(component.signalementForm.controls['nom']).toBeDefined();
      expect(component.signalementForm.controls['email']).toBeDefined();
      expect(component.signalementForm.controls['accordContact']).toBeDefined();
      expect(component.signalementForm.controls['anomalyType']).toBeUndefined();
      expect(component.signalementForm.controls['anomalyPrecision']).toBeUndefined();
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

  describe('changeTypeEtablissement function', () => {

    it('should load anomalyType list for selected typeEtablissement and add a form control for anomalyType', () => {
      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);

      component.changeTypeEtablissement();

      expect(component.anomalyTypeList).toEqual(typeAnomalieListEtablissement2);
      expect(component.signalementForm.controls['anomalyType']).not.toBeNull();
    });
  });

  describe('changeAnomalyCategory function', () => {

    it('should reset anomalyPrecision list and delete anomalyPrecision form control when no typeAnomaly is selected', () => {
      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.anomalyCategoryCtrl.setValue('');

      component.changeAnomalyCategory();

      expect(component.anomalyPrecisionList).toEqual([]);
      expect(component.signalementForm.controls['anomalyPrecision']).toBeUndefined();
    });

    it('should load anomalyPrecision list for selected typeEtablissement and anomalyType', () => {

      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.anomalyCategoryCtrl.setValue(typeAnomalie22.category);

      component.changeAnomalyCategory();

      expect(component.anomalyPrecisionList).toEqual(precisionList22);
    });

    it('should add a form control for anomalyPrecision if loaded list is not empty', () => {

      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.anomalyCategoryCtrl.setValue(typeAnomalie22.category);

      component.changeAnomalyCategory();

      expect(component.anomalyPrecisionList).toEqual(precisionList22);
      expect(component.signalementForm.controls['anomalyPrecision']).not.toBeNull();
    });

    it('should not add a form control for anomalyPrecision if loaded list is empty', () => {

      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.anomalyCategoryCtrl.setValue(typeAnomalie21.category);

      component.changeAnomalyCategory();

      expect(component.signalementForm.controls['anomalyPrecision']).toBeUndefined();
    });
  });

  describe('createSignalement function', () => {

    it('should display errors when form is invalid', () => {
      component.typeEtablissementCtrl.setValue('');

      component.createSignalement();

      expect(component.showErrors).toBeTruthy();
    });

    it('should call a creation service with a signalement object', () => {
      const dateConstat = new Date();
      const anomalieFile = new File([], 'anomalie.jpg');
      component.typeEtablissementCtrl.setValue('typeEtablissement');
      component.anomalyCategoryCtrl.setValue('category');
      component.anomalyPrecisionCtrl.setValue('precision');
      component.dateConstatCtrl.setValue(dateConstat);
      component.heureConstatCtrl.setValue(5);
      component.nomCtrl.setValue('nom');
      component.prenomCtrl.setValue('prenom');
      component.emailCtrl.setValue('email@mail.fr');
      component.accordContactCtrl.setValue(true);
      component.anomalyFile = anomalieFile;
      component.companyCtrl.setValue(Object.assign(
        new Company(),
        {
          name: 'Mon établissement',
          line1: 'adresse 1',
          line3: 'adresse 3',
          line4: 'adresse 4',
          siret: '123245678900015'
        }
      ));

      spyOn(signalementService, 'createSignalement').and.returnValue(of());

      component.createSignalement();
      const signalement = new Signalement();
      signalement.typeEtablissement = 'typeEtablissement';
      signalement.categorieAnomalie = 'category';
      signalement.precisionAnomalie = 'precision';
      signalement.nomEtablissement = 'Mon établissement';
      signalement.adresseEtablissement = 'adresse 1 - adresse 3 - adresse 4';
      signalement.siretEtablissement = '123245678900015';
      signalement.description = '';
      signalement.dateConstat = dateConstat;
      signalement.heureConstat = 5;
      signalement.nom = 'nom';
      signalement.prenom = 'prenom';
      signalement.email = 'email@mail.fr';
      signalement.accordContact = true;
      signalement.ticketFile = undefined;
      signalement.anomalieFile = anomalieFile;
      expect(signalementService.createSignalement).toHaveBeenCalledWith(signalement);
    });

    it('should display a success message when signalement creation succeed', (done) => {
      component.typeEtablissementCtrl.setValue('typeEtablissement');
      component.companyCtrl.setValue(new Company());
      component.dateConstatCtrl.setValue(new Date());
      component.nomCtrl.setValue('nom');
      component.prenomCtrl.setValue('prenom');
      component.emailCtrl.setValue('email@mail.fr');
      const signalementServiceSpy = spyOn(signalementService, 'createSignalement').and.returnValue(of(new Signalement()));

      component.createSignalement();
      signalementServiceSpy.calls.mostRecent().returnValue.subscribe(() => {
        expect(component.showSuccess).toBeTruthy();
        done();
      });

    });

  });

  describe('case of intoxication alimentaire', () => {

    it('should display a specific label for the submit button', () => {

      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.anomalyCategoryCtrl.setValue(typeAnomalieIntoxicationAlimentaire.category);

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('button[type="submit"].btn-primary').textContent.trim()).toBe('Suivant');

    });

  });

  describe('case of anomaly which do not require a report', () => {

    it('should display an information message when there is an anomaly info linked to the anomaly', () => {

      component.ngOnInit();
      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.anomalyCategoryCtrl.setValue(typeAnomalie22.category);
      component.anomalyPrecisionCtrl.setValue(precisionList22[0]);

      component.changeAnomalyPrecision();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('.notification')).not.toBeNull();
    });

  });
});

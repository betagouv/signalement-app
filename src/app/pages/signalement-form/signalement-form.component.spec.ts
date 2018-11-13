import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalementFormComponent } from './signalement-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnomalieService } from '../../services/anomalie.service';
import { Anomalie, TypeAnomalie } from '../../model/Anomalie';
import { of } from 'rxjs';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';
import { SignalementService } from '../../services/signalement.service';
import { Signalement } from '../../model/Signalement';
import { ServiceUtils } from '../../services/service.utils';

describe('SignalementFormComponent', () => {

  let component: SignalementFormComponent;
  let fixture: ComponentFixture<SignalementFormComponent>;
  let anomalieService: AnomalieService;
  let signalementService: SignalementService;

  const typeEtablissement1 = 'typeEtablissement1';
  const typeAnomalieListEtablissement1 = [
    deserialize(TypeAnomalie, {categorie: 'typeAnomalie11'}),
    deserialize(TypeAnomalie, {categorie: 'typeAnomalie12'})
  ];
  const typeEtablissement2 = 'typeEtablissement2';
  const precisionList22 = ['precision221', 'precision222', 'precision2223'];
  const typeAnomalie22 = deserialize(TypeAnomalie, {categorie: 'typeAnomalie22', precisionList: precisionList22});
  const typeAnomalieListEtablissement2 = [
    deserialize(TypeAnomalie, {categorie: 'typeAnomalie21'}),
    typeAnomalie22,
    deserialize(TypeAnomalie, {categorie: 'typeAnomalie23'})
  ];

  const anomaliesFixture = [
    deserialize(Anomalie, {typeEtablissement: typeEtablissement1, typeAnomalieList: typeAnomalieListEtablissement1}),
    deserialize(Anomalie, {typeEtablissement: typeEtablissement2, typeAnomalieList: typeAnomalieListEtablissement2}),
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalementFormComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers: [
        AnomalieService,
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
    anomalieService = TestBed.get(AnomalieService);
    signalementService = TestBed.get(SignalementService);
    spyOn(anomalieService, 'getAnomalies').and.returnValue(of(anomaliesFixture));
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

    it('should not display a select input for typeAnomalie on init', () => {
      component.ngOnInit();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="typeAnomalie"]')).toBeNull();
    });

    it('should display a select input for categorieAnomalie with categorieAnomalie list as options when associated form control is defined', () => {
      component.signalementForm.addControl('categorieAnomalie', component.categoryAnomalieCtrl);
      component.typeAnomalieList = typeAnomalieListEtablissement1;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="categorieAnomalie"]')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="categorieAnomalie"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="categorieAnomalie"] option').length)
        .toBe(typeAnomalieListEtablissement1.length + 1);
    });

    it('should not display a select input for precisionAnomalie on init', () => {
      component.ngOnInit();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="precisionAnomalie"]')).toBeNull();
    });

    it('should display a select input for precisionAnomalie with precisionAnomalie list as options when associated form control is defined', () => {
      component.signalementForm.addControl('precisionAnomalie', component.precisionAnomalieCtrl);
      component.precisionAnomalieList = precisionList22;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="precisionAnomalie"]')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="precisionAnomalie"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="precisionAnomalie"] option').length)
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

    it('should load anomalie list', () => {
      component.ngOnInit();

      expect(anomalieService.getAnomalies).toHaveBeenCalled();
      expect(component.anomalies).toEqual(anomaliesFixture);
    });

    it('should set all form controls except for typeAnomalie and precisionAnomalie', () => {
      component.ngOnInit();

      expect(component.signalementForm.controls['nomEtablissement']).toBeDefined();
      expect(component.signalementForm.controls['adresseEtablissement']).toBeDefined();
      expect(component.signalementForm.controls['description']).toBeDefined();
      expect(component.signalementForm.controls['photo']).toBeDefined();
      expect(component.signalementForm.controls['prenom']).toBeDefined();
      expect(component.signalementForm.controls['nom']).toBeDefined();
      expect(component.signalementForm.controls['email']).toBeDefined();
      expect(component.signalementForm.controls['typeAnomalie']).toBeUndefined();
      expect(component.signalementForm.controls['precisionAnomalie']).toBeUndefined();
    });

    it('should not display form errors', () => {
      component.ngOnInit();

      expect(component.showErrors).toBeFalsy();
    });

  });

  describe('changeTypeEtablissement function', () => {

    it('should load typeAnomalie list for selected typeEtablissement and add a form control for typeAnomalie', () => {
      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);

      component.changeTypeEtablissement();

      expect(component.typeAnomalieList).toEqual(typeAnomalieListEtablissement2);
      expect(component.signalementForm.controls['typeAnomalie']).not.toBeNull();
    });
  });

  describe('changeCategorieAnomalie function', () => {

    it('should reset precisionAnomalie list and delete precisionAnomalie form control when no typeAnomaly is selected', () => {
      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.categoryAnomalieCtrl.setValue('');

      component.changeCategorieAnomalie();

      expect(component.precisionAnomalieList).toEqual([]);
      expect(component.signalementForm.controls['precisionAnomalie']).toBeUndefined();
    });

    it('should load precisionAnomalie list for selected typeEtablissement and typeAnomalie and add a form control for precisionAnomalie', () => {
      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.categoryAnomalieCtrl.setValue(typeAnomalie22.categorie);

      component.changeCategorieAnomalie();

      expect(component.precisionAnomalieList).toEqual(precisionList22);
      expect(component.signalementForm.controls['precisionAnomalie']).not.toBeNull();
    });
  });

  describe('createSignalement function', () => {

    it('should display errors when form is invalid', () => {
      component.typeEtablissementCtrl.setValue('');

      component.createSignalement();

      expect(component.showErrors).toBeTruthy();
    });

    it('should call a creation service with a signalement object', () => {
      component.typeEtablissementCtrl.setValue('typeEtablissement');
      component.nomEtablissementCtrl.setValue('nomEtablissement');
      component.adresseEtablissementCtrl.setValue('adresseEtablissement');
      component.nomCtrl.setValue('nom');
      component.prenomCtrl.setValue('prenom');
      component.emailCtrl.setValue('email@mail.fr');
      spyOn(signalementService, 'createSignalement').and.returnValue(of());

      component.createSignalement();

      const signalement = new Signalement();
      signalement.typeEtablissement = 'typeEtablissement';
      signalement.nomEtablissement = 'nomEtablissement';
      signalement.adresseEtablissement = 'adresseEtablissement';
      signalement.description = '';
      signalement.nom = 'nom';
      signalement.prenom = 'prenom';
      signalement.email = 'email@mail.fr';
      signalement.photo = '';
      expect(signalementService.createSignalement).toHaveBeenCalledWith(signalement);
    });

    it('should display a success message when signalement creation succeed', (done) => {
      component.typeEtablissementCtrl.setValue('typeEtablissement');
      component.nomEtablissementCtrl.setValue('nomEtablissement');
      component.adresseEtablissementCtrl.setValue('adresseEtablissement');
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
});

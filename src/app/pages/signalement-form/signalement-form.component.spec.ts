import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalementFormComponent } from './signalement-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnomalieService } from '../../services/anomalie.service';
import { Anomalie, TypeAnomalie } from '../../model/Anomalie';
import { of } from 'rxjs';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';

describe('SignalementFormComponent', () => {

  let component: SignalementFormComponent;
  let fixture: ComponentFixture<SignalementFormComponent>;
  let anomalieService: AnomalieService;

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

  const anomalieListFixture = {
    list: anomaliesFixture
  };

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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    anomalieService = TestBed.get(AnomalieService);
    spyOn(anomalieService, 'getAnomalies').and.returnValue(of(anomalieListFixture));
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

    it('should display a select input for typeAnomalie with typeAnomalie list as options when associated form control is defined', () => {
      component.signalementForm.addControl('typeAnomalie', component.typeAnomalieCtrl);
      component.typeAnomalieList = typeAnomalieListEtablissement1;

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('select[formcontrolname="typeAnomalie"]')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="typeAnomalie"] option')).not.toBeNull();
      expect(nativeElement.querySelectorAll('select[formcontrolname="typeAnomalie"] option').length)
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
  });

  describe('ngOnInit function', () => {

    it('should load anomalie list', () => {
      component.ngOnInit();

      expect(anomalieService.getAnomalies).toHaveBeenCalled();
      expect(component.anomalies).toEqual(anomaliesFixture);
    });

    it('should not set form control for typeAnomalie and precisionAnomalie', () => {
      component.ngOnInit();

      expect(component.signalementForm.controls['typeAnomalie']).toBeUndefined();
      expect(component.signalementForm.controls['precisionAnomalie']).toBeUndefined();
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

  describe('changeTypeAnomalie function', () => {

    it('should reset precisionAnomalie list and delete precisionAnomalie form control when no typeAnomaly is selected', () => {
      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.typeAnomalieCtrl.setValue('');

      component.changeTypeAnomalie();

      expect(component.precisionAnomalieList).toEqual([]);
      expect(component.signalementForm.controls['precisionAnomalie']).toBeUndefined();
    });

    it('should load precisionAnomalie list for selected typeEtablissement and typeAnomalie and add a form control for precisionAnomalie', () => {
      component.anomalies = anomaliesFixture;
      component.typeEtablissementCtrl.setValue(typeEtablissement2);
      component.typeAnomalieCtrl.setValue(typeAnomalie22.categorie);

      component.changeTypeAnomalie();

      expect(component.precisionAnomalieList).toEqual(precisionList22);
      expect(component.signalementForm.controls['precisionAnomalie']).not.toBeNull();
    });
  });
});

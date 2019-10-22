import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DetailsComponent } from './details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { DetailInputValue, Report, Step } from '../../../model/Report';
import { DetailInput, Subcategory } from '../../../model/Anomaly';
import { CollapsableTextComponent } from '../../../components/collapsable-text/collapsable-text.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { ReportPaths } from '../../../services/report-router.service';
import { UploadedFile } from '../../../model/UploadedFile';
import { NgxLoadingModule } from 'ngx-loading';
import moment from 'moment';
import { ReportStorageService } from '../../../services/report-storage.service';

describe('DetailsComponent', () => {

  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let reportStorageService: ReportStorageService;

  const anomalyDateFixture = new Date(2018, 1, 2);
  const anomalyFileFixture = Object.assign(new UploadedFile(), {
    id: '856cdf46-a8c2-436d-a34c-bb303ff108a6',
    filename: 'anomaly.jpg'
  });

  const textDetailInputFixture = Object.assign(new DetailInput(), {
    label: 'texte label',
    rank: 1,
    type: 'TEXT'
  });

  const dateDetailInputFixture = Object.assign(new DetailInput(), {
    label: 'date label',
    rank: 2,
    type: 'DATE',
    defaultValue: 'SYSDATE'
  });

  const radioDetailInputFixture = Object.assign(new DetailInput(), {
    label: 'radio label',
    rank: 3,
    type: 'RADIO',
    options: ['OPTION1', 'OPTION2 (à préciser)']
  });

  const checkboxDetailInputFixture = Object.assign(new DetailInput(), {
    label: 'checkbox label',
    rank: 5,
    type: 'CHECKBOX',
    options: ['CHECKBOX1', 'CHECKBOX2 (à préciser)', 'CHECKBOX3']
  });

  const textareaDetailInputFixture = Object.assign(new DetailInput(), {
    label: 'description',
    rank: 4,
    type: 'TEXTAREA'
  });

  beforeEach(async(() => {
    defineLocale('fr', frLocale);
    TestBed.configureTestingModule({
      declarations: [
        DetailsComponent,
        BreadcrumbComponent,
        CollapsableTextComponent,
        TruncatePipe,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: ReportPaths.Company, redirectTo: '' }]),
        BsDatepickerModule.forRoot(),
        Angulartics2RouterlessModule.forRoot(),
        NgxLoadingModule,
        NoopAnimationsModule
      ],
      providers: []
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));


  describe('case of default detail inputs', () => {

    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      reportStorageService.changeReportInProgress(new Report());

      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it ('should define the plageHoraireList to display', () => {
      expect(component.plageHoraireList).toBeDefined();
      expect(component.plageHoraireList.length).toBe(24);
    });

    it('should initialize the form inputs with default details input', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('input').length).toEqual(2);
      expect(nativeElement.querySelector('textarea#formControl_1')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="text"]#formControl_2')).not.toBeNull();
      expect(nativeElement.querySelector('select#formControl_3')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="file"]')).not.toBeNull();
    });

    it('should display errors on submit', () => {
      component.submitDetailsForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it ('should emit and event with a details object which contains form inputs when no errors', () => {
      component.detailsForm.controls.formControl_1.setValue('valeur');
      component.detailsForm.controls.formControl_2.setValue(anomalyDateFixture);
      component.detailsForm.controls.formControl_3.setValue('de 2h à 3h');
      const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const reportExpected = new Report();
      reportExpected.detailInputValues = [
        Object.assign(new DetailInputValue(), {label: 'Description', value: 'valeur'}),
        Object.assign(new DetailInputValue(), {label: 'Date du constat', value: anomalyDateFixture}),
        Object.assign(new DetailInputValue(), {label: 'Heure du constat', value: 'de 2h à 3h'})
      ];
      reportExpected.uploadedFiles = [];
      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Details);
    });

  });


  describe('case of report subcategory with only a text detail input', () => {

    const reportWithSubcategory = new Report();
    reportWithSubcategory.subcategories = [new Subcategory()];
    reportWithSubcategory.subcategories[0].detailInputs = [Object.assign(new DetailInput(), textDetailInputFixture)];

    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      reportStorageService.changeReportInProgress(reportWithSubcategory);

      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize the form inputs with anomaly details input', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('input').length).toEqual(2);
      expect(nativeElement.querySelector('input[type="text"]#formControl_1')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="file"]')).not.toBeNull();
    });

    it('should display errors on submit', () => {
      component.submitDetailsForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it ('should emit and event with a details object which contains form inputs when no errors', () => {
      component.detailsForm.controls.formControl_1.setValue('valeur');
      const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const reportExpected = new Report();
      reportExpected.subcategories = reportWithSubcategory.subcategories;
      reportExpected.detailInputValues = [Object.assign(new DetailInputValue(), {label: textDetailInputFixture.label, value: 'valeur'})];
      reportExpected.uploadedFiles = [];
      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Details);
    });

  });

  describe('case of report subcategory with several detail inputs', () => {

    const reportWithSubcategory = new Report();
    reportWithSubcategory.subcategories = [new Subcategory()];
    reportWithSubcategory.subcategories[0].detailInputs = [
      dateDetailInputFixture,
      textDetailInputFixture,
      radioDetailInputFixture,
      textareaDetailInputFixture,
      checkboxDetailInputFixture
    ];

    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      reportStorageService.changeReportInProgress(reportWithSubcategory);

      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize the form inputs with anomaly details input', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('input').length).toEqual(8);
      expect(nativeElement.querySelector('input[type="text"]#formControl_1')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="text"]#formControl_2')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="text"]#formControl_2').value).toEqual(moment(new Date()).format('DD/MM/YYYY'));
      expect(nativeElement.querySelector('input[type="radio"]#formControl_3_0')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="radio"]#formControl_3_1')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="checkbox"]#formControl_5_0')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="checkbox"]#formControl_5_1')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="checkbox"]#formControl_5_2')).not.toBeNull();
      expect(nativeElement.querySelector('textarea#formControl_4')).not.toBeNull();
      expect(nativeElement.querySelector('input[type="file"]')).not.toBeNull();
    });

    it('should display errors on submit', () => {

      component.submitDetailsForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it('should display an additionnal text input when precision on radio input is required', () => {
      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('input[type="radio"]#formControl_3_1').click();
      nativeElement.querySelector('input[type="checkbox"]#formControl_5_1').click();
      fixture.detectChanges();

      expect(nativeElement.querySelector('input[type="text"]#formControl_3_1_precision')).not.toBeNull();
    });

    it ('should emit and event with a details object which contains form inputs when no errors', () => {
      component.detailsForm.controls.formControl_1.setValue('valeur');
      component.detailsForm.controls.formControl_2.setValue(anomalyDateFixture);
      component.detailsForm.controls.formControl_4.setValue('ma description');
      const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('input[type="radio"]#formControl_3_1').click();
      nativeElement.querySelector('input[type="checkbox"]#formControl_5_0').click();
      nativeElement.querySelector('input[type="checkbox"]#formControl_5_2').click();
      fixture.detectChanges();
      nativeElement.querySelector('input[type="text"]#formControl_3_1_precision').value = 'ma précision';
      nativeElement.querySelector('input[type="text"]#formControl_3_1_precision').dispatchEvent(new Event('input'));
      fixture.detectChanges();
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const reportExpected = new Report();
      reportExpected.subcategories = reportWithSubcategory.subcategories;
      reportExpected.detailInputValues = [
        Object.assign(new DetailInputValue(), {label: textDetailInputFixture.label, value: 'valeur'}),
        Object.assign(new DetailInputValue(), {label: dateDetailInputFixture.label, value: anomalyDateFixture}),
        Object.assign(new DetailInputValue(), {
          label: radioDetailInputFixture.label,
          value: radioDetailInputFixture.options[1] + 'ma précision'}),
        Object.assign(new DetailInputValue(), {label: textareaDetailInputFixture.label, value: 'ma description'}),
        Object.assign(new DetailInputValue(), {label: checkboxDetailInputFixture.label, value: ['CHECKBOX1', undefined, 'CHECKBOX3']}),
      ];
      reportExpected.uploadedFiles = [];
      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Details);
    });

  });

});

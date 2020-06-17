import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DetailsComponent } from './details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { DetailInputValue, DraftReport, Step } from '../../../model/Report';
import { DetailInput, Subcategory } from '../../../model/Anomaly';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportPaths } from '../../../services/report-router.service';
import { NgxLoadingModule } from 'ngx-loading';
import moment from 'moment';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { of } from 'rxjs';
import { genDraftReport, oneBoolean } from '../../../../../test/fixtures.spec';

describe('DetailsComponent', () => {

  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let reportStorageService: ReportStorageService;

  const anomalyDateFixture = new Date(2018, 1, 2);

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
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: `:category/${ReportPaths.Company}`, redirectTo: '' }]),
        BsDatepickerModule.forRoot(),
        Angulartics2RouterlessModule.forRoot(),
        NgxLoadingModule,
        NoopAnimationsModule,
        ComponentsModule,
        PipesModule
      ],
      providers: []
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  describe('on init', () => {

    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(genDraftReport(Step.Problem)));
      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should request the user if he is an employee of the company or not', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('h2').textContent).toEqual(`Est-ce que vous travaillez dans l'entreprise que vous souhaitez signaler ?`);
      expect(nativeElement.querySelectorAll('button')[0].textContent.trim()).toEqual('Oui');
      expect(nativeElement.querySelectorAll('button')[1].textContent.trim()).toEqual('Non, je n\'y travaille pas');
      expect(nativeElement.querySelector('form')).toBeNull();
    });

    it('should hide the question and display the details form when the user answers', () => {
      const nativeElement = fixture.nativeElement;
      nativeElement.querySelectorAll('button')[0].click();

      fixture.detectChanges();
      expect(nativeElement.querySelector('h2')).toBeNull();
      expect(nativeElement.querySelector('form')).not.toBeNull();
    });
  });

  describe('case of default detail inputs', () => {

    const draftReportInProgress = Object.assign(genDraftReport(Step.Problem), {
      employeeConsumer: oneBoolean(),
      storedStep: Step.Problem
    });

    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));
      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
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
      const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
        detailInputValues: [
          Object.assign(new DetailInputValue(), {label: 'Description', value: 'valeur'}),
          Object.assign(new DetailInputValue(), {label: 'Date du constat', value: anomalyDateFixture})
        ],
        uploadedFiles: []
      });
      expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Details);
    });

  });


  describe('case of report subcategory with only a text detail input', () => {

    const draftReportInProgress = Object.assign(genDraftReport(Step.Problem), {
      subcategories: [
        Object.assign(new Subcategory(), {
          detailInputs : [
            textDetailInputFixture
          ]
        })
      ],
      employeeConsumer: oneBoolean(),
      storedStep: Step.Problem
    });

    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));
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

      const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
        detailInputValues: [
          Object.assign(new DetailInputValue(), {label: textDetailInputFixture.label, value: 'valeur'})
        ],
        uploadedFiles: []
      });
      expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Details);
    });

  });

  describe('case of report subcategory with several detail inputs', () => {

    const draftReportInProgress = Object.assign(genDraftReport(Step.Problem), {
      subcategories: [
        Object.assign(new Subcategory(), {
          detailInputs : [
            dateDetailInputFixture,
            textDetailInputFixture,
            radioDetailInputFixture,
            textareaDetailInputFixture,
            checkboxDetailInputFixture
          ]
        })
      ],
      employeeConsumer: oneBoolean(),
      storedStep: Step.Problem
    });

    beforeEach(() => {
      reportStorageService = TestBed.get(ReportStorageService);
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));
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

      const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
        detailInputValues: [
          Object.assign(new DetailInputValue(), {label: textDetailInputFixture.label, value: 'valeur'}),
          Object.assign(new DetailInputValue(), {label: dateDetailInputFixture.label, value: anomalyDateFixture}),
          Object.assign(new DetailInputValue(), {
            label: radioDetailInputFixture.label,
            value: radioDetailInputFixture.options[1] + 'ma précision'}),
          Object.assign(new DetailInputValue(), {label: textareaDetailInputFixture.label, value: 'ma description'}),
          Object.assign(new DetailInputValue(), {label: checkboxDetailInputFixture.label, value: ['CHECKBOX1', undefined, 'CHECKBOX3']})
        ],
        uploadedFiles: []
      });
      expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Details);
    });

  });

});

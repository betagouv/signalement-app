import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { Report, ReportDetails } from '../../../model/Report';
import { Precision, Subcategory, SubcategoryDetails } from '../../../model/Anomaly';
import { CollapsableTextComponent } from '../../../components/collapsable-text/collapsable-text.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from '../../../services/report.service';
import { of } from 'rxjs';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { ReportPaths, Step } from '../../../services/report-router.service';
import { UploadedFile } from '../../../model/UploadedFile';
import { NgxLoadingModule } from 'ngx-loading';

describe('DetailsComponent', () => {

  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let reportService: ReportService;

  const anomalyDateFixture = new Date(2018, 1, 2);
  const anomalyFileFixture = Object.assign(new UploadedFile(), {
    id: '856cdf46-a8c2-436d-a34c-bb303ff108a6',
    filename: 'anomaly.jpg'
  });
  const reportDetailsFixture = new ReportDetails();
  reportDetailsFixture.description = 'Description';
  reportDetailsFixture.anomalyDate = anomalyDateFixture;
  reportDetailsFixture.anomalyTimeSlot = 5;

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
      ],
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));


  describe('commons tests', () => {

    beforeEach(() => {
      reportService = TestBed.get(ReportService);
      reportService.currentReport = of(new Report());

      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initially display the form and no errors message', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(nativeElement.querySelector('.notification.error')).toBeNull();
    });

    it('should initialize the details inputs with empty values and current date when there is no initial value', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('textarea[formControlName="description"]').value).toEqual('');
      expect(nativeElement.querySelector('input[formControlName="anomalyDate"]').value).toEqual((new Date()).toLocaleDateString('fr'));
      expect(nativeElement.querySelector('select').value).toEqual('');
    });

    it('should initialize the details inputs with initial value when it exists', () => {
      const reportWithDetails = new Report();
      reportWithDetails.details = reportDetailsFixture;
      reportService.currentReport = of(reportWithDetails);

      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('textarea[formControlName="description"]').value).toEqual(reportDetailsFixture.description);
      expect(nativeElement.querySelector('input[formControlName="anomalyDate"]').value)
        .toEqual(reportDetailsFixture.anomalyDate.toLocaleDateString('fr'));
      expect(nativeElement.querySelector('select').value).toEqual(reportDetailsFixture.anomalyTimeSlot.toString());
    });

    it ('should define the plageHoraireList to display', () => {
      expect(component.plageHoraireList).toBeDefined();
      expect(component.plageHoraireList.length).toBe(24);
    });

  });


  describe('case of report subcategory with a precision list and mutiple selection not allowed', () => {

    const reportWithSubcategory = new Report();
    reportWithSubcategory.subcategory = new Subcategory();
    const precision = new Precision();
    precision.title = 'titre precision';
    precision.options = [ {title: 'option 1'}, { title: 'option 2'}, { title: 'Autre'}];
    const subcategoryDetails = new SubcategoryDetails();
    subcategoryDetails.precision = precision;
    reportWithSubcategory.subcategory.details = subcategoryDetails;

    beforeEach(() => {
      reportService = TestBed.get(ReportService);
      reportService.currentReport = of(reportWithSubcategory);

      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sould display radio inputs to select precision', () => {
      const nativeElement = fixture.nativeElement;
      expect(component.singlePrecisionCtrl).toBeDefined();
      expect(component.multiplePrecisionCtrl).toBeUndefined();
      expect(nativeElement.querySelectorAll('input[formControlName="singlePrecision"]').length).toEqual(precision.options.length);
    });

    it('should display an additionnal text input when precision "Autre" is checked', () => {
      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('#radio-Autre').click();
      fixture.detectChanges();

      expect(nativeElement.querySelector('input[formControlName="otherPrecision"]')).not.toBeNull();
    });

    it('should display errors on submit', () => {
      component.singlePrecisionCtrl.setValue('');

      component.submitDetailsForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it ('should emit and event with a details object which contains form inputs when no errors', () => {
      component.descriptionCtrl.setValue('Description');
      component.singlePrecisionCtrl.setValue('Autre');
      component.otherPrecisionCtrl = component.formBuilder.control('Autre précision');
      component.detailsForm.addControl('otherPrecision', component.otherPrecisionCtrl);
      component.anomalyDateCtrl.setValue(anomalyDateFixture);
      component.anomalyTimeSlotCtrl.setValue(5);
      component.uploadedFiles = [anomalyFileFixture];
      const changeReportSpy = spyOn(reportService, 'changeReportFromStep');

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const detailsExpected = new ReportDetails();
      detailsExpected.description = 'Description';
      detailsExpected.precision = 'Autre';
      detailsExpected.otherPrecision = 'Autre précision';
      detailsExpected.anomalyDate = anomalyDateFixture;
      detailsExpected.anomalyTimeSlot = 5;
      detailsExpected.uploadedFiles = [anomalyFileFixture];
      const reportExpected = new Report();
      reportExpected.subcategory = new Subcategory();
      reportExpected.subcategory.details = subcategoryDetails;
      reportExpected.details = detailsExpected;

      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Details);
    });
  });

  describe('case of report subcategory with a precision list and mutiple selection allowed', () => {

    const reportWithSubcategory = new Report();
    reportWithSubcategory.subcategory = new Subcategory();
    const precision = new Precision();
    precision.title = 'titre precision';
    precision.severalOptionsAllowed = true;
    precision.options = [ {title: 'option 1'}, { title: 'option 2'}, { title: 'option 3'}, { title: 'Autre'}];
    const subcategoryDetails = new SubcategoryDetails();
    subcategoryDetails.precision = precision;
    reportWithSubcategory.subcategory.details = subcategoryDetails;

    beforeEach(() => {
      reportService = TestBed.get(ReportService);
      reportService.currentReport = of(reportWithSubcategory);

      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sould display checkbox inputs to select precisions', () => {
      const nativeElement = fixture.nativeElement;
      expect(component.singlePrecisionCtrl).toBeUndefined();
      expect(component.multiplePrecisionCtrl).toBeDefined();
      expect(nativeElement.querySelectorAll('input[type="checkbox"]').length).toEqual(precision.options.length);
    });

    it('should display an additionnal text input when precision "Autre" is checked', () => {
      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('#checkbox-Autre').click();
      fixture.detectChanges();

      expect(nativeElement.querySelector('input[formControlName="otherPrecision"]')).not.toBeNull();
    });

    it('should display errors on submit', () => {
      component.anomalyDateCtrl.setValue('');

      component.submitDetailsForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it ('should emit and event with a company which contains form inputs when no errors', () => {
      component.descriptionCtrl.setValue('Description');
      component.multiplePrecisionCtrl.controls[0].setValue(true);
      component.multiplePrecisionCtrl.controls[1].setValue(false);
      component.multiplePrecisionCtrl.controls[2].setValue(true);
      component.anomalyDateCtrl.setValue(anomalyDateFixture);
      component.anomalyTimeSlotCtrl.setValue(5);
      component.uploadedFiles = [anomalyFileFixture];
      const changeReportSpy = spyOn(reportService, 'changeReportFromStep');

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const detailsExpected = new ReportDetails();
      detailsExpected.description = 'Description';
      detailsExpected.precision = ['option 1', 'option 3'];
      detailsExpected.anomalyDate = anomalyDateFixture;
      detailsExpected.anomalyTimeSlot = 5;
      detailsExpected.uploadedFiles = [anomalyFileFixture];
      const reportExpected = new Report();
      reportExpected.subcategory = new Subcategory();
      reportExpected.subcategory.details = subcategoryDetails;
      reportExpected.details = detailsExpected;

      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Details);
    });

  });


  describe('case of report subcategory without precision list', () => {

    const reportWithSubcategory = new Report();
    reportWithSubcategory.subcategory = new Subcategory();
    const subcategoryDetails = new SubcategoryDetails();
    reportWithSubcategory.subcategory.details = subcategoryDetails;

    beforeEach(() => {
      reportService = TestBed.get(ReportService);
      reportService.currentReport = of(reportWithSubcategory);

      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('sould not display inputs to select precision', () => {
      const nativeElement = fixture.nativeElement;
      expect(component.singlePrecisionCtrl).toBeUndefined();
      expect(component.multiplePrecisionCtrl).toBeUndefined();
      expect(nativeElement.querySelectorAll('input[type="radio"]').length).toEqual(0);
      expect(nativeElement.querySelectorAll('input[type="checkbox"]').length).toEqual(0);
    });

    it('should display errors on submit', () => {
      component.anomalyDateCtrl.setValue('');

      component.submitDetailsForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it ('should emit and event with a company which contains form inputs when no errors', () => {
      component.descriptionCtrl.setValue('Description');
      component.anomalyDateCtrl.setValue(anomalyDateFixture);
      component.anomalyTimeSlotCtrl.setValue(5);
      component.uploadedFiles = [anomalyFileFixture];
      const changeReportSpy = spyOn(reportService, 'changeReportFromStep');

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const detailsExpected = new ReportDetails();
      detailsExpected.description = 'Description';
      detailsExpected.anomalyDate = anomalyDateFixture;
      detailsExpected.anomalyTimeSlot = 5;
      detailsExpected.uploadedFiles = [anomalyFileFixture];
      const reportExpected = new Report();
      reportExpected.subcategory = new Subcategory();
      reportExpected.subcategory.details = subcategoryDetails;
      reportExpected.details = detailsExpected;

      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Details);
    });

  });
});

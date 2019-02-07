import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryComponent } from './subcategory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anomaly, Subcategory } from '../../../model/Anomaly';
import { deserialize } from 'json-typescript-mapper';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { CollapsableTextComponent } from '../../../components/collapsable-text/collapsable-text.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService, Step } from '../../../services/report.service';
import { of } from 'rxjs';
import { Report } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';

describe('SubcategoryComponent', () => {

  let component: SubcategoryComponent;
  let fixture: ComponentFixture<SubcategoryComponent>;
  let reportService: ReportService;
  let anomalyService: AnomalyService;

  const reportFixture = new Report();
  reportFixture.category = 'catégorie';

  const subcategoriesFixture = [
    deserialize(Subcategory, { title: 'title1', description: 'description1' }),
    deserialize(Subcategory, { title: 'title2', description: 'description2' }),
    deserialize(Subcategory, { title: 'title3', description: 'description3' }),
  ];

  const anomalyFixture = new Anomaly();
  anomalyFixture.category = reportFixture.category;
  anomalyFixture.subcategories = subcategoriesFixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubcategoryComponent,
        BreadcrumbComponent,
        CollapsableTextComponent,
        TruncatePipe,
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
        AnomalyService,
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    anomalyService = TestBed.get(AnomalyService);
    reportService = TestBed.get(ReportService);
    reportService.currentReport = of(reportFixture);

    fixture = TestBed.createComponent(SubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit function', () => {

    it('should initially display the form with subcategories as radio buttons list and no errors message', () => {
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);

      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(nativeElement.querySelectorAll('input[type="radio"]').length).toEqual(subcategoriesFixture.length);
      expect(nativeElement.querySelector('.notification.error')).toBeNull();
    });

    it('should define all form controls', () => {
      expect(component.subcategoryForm.controls['anomalySubcategory']).toEqual(component.anomalySubcategoryCtrl);
    });

  });

  describe('submitSubcategoryForm function', () => {

    it('should display errors when occurs', () => {
      component.anomalySubcategoryCtrl.setValue('');

      component.submitSubcategoryForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it('should change the shared report with a report which contains a subcategory when no errors', () => {
      component.subcategories = subcategoriesFixture;
      component.anomalySubcategoryCtrl.setValue('title2');
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
      const changeReportSpy = spyOn(reportService, 'changeReport');
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      const subcategoryExpected = new Subcategory();
      subcategoryExpected.title = 'title2';
      subcategoryExpected.description = 'description2';
      const reportExpected = new Report();
      reportExpected.category = reportFixture.category;
      reportExpected.subcategory = subcategoryExpected;

      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Subcategory);

    });
  });
});

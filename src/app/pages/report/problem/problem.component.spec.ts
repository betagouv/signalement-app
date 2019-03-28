import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemComponent } from './problem.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anomaly, Subcategory } from '../../../model/Anomaly';
import { deserialize } from 'json-typescript-mapper';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { CollapsableTextComponent } from '../../../components/collapsable-text/collapsable-text.component';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from '../../../services/report.service';
import { of } from 'rxjs';
import { Report } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportPaths, Step } from '../../../services/report-router.service';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProblemComponent', () => {

  let component: ProblemComponent;
  let fixture: ComponentFixture<ProblemComponent>;
  let reportService: ReportService;
  let anomalyService: AnomalyService;

  const reportFixture = new Report();
  reportFixture.category = 'catégorie';

  const subcategoriesFixture = [
    deserialize(Subcategory, { title: 'title1', description: 'description1' }),
    deserialize(Subcategory, { title: 'title2', description: 'description2' }),
    deserialize(Subcategory, {
      title: 'title3',
      description: 'description3',
      subcategories: [
        deserialize(Subcategory, { title: 'title31', description: 'description31' }),
        deserialize(Subcategory, { title: 'title32', description: 'description32' })
        ]
    }),
  ];

  const anomalyFixture = new Anomaly();
  anomalyFixture.category = reportFixture.category;
  anomalyFixture.subcategories = subcategoriesFixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProblemComponent,
        SubcategoryComponent,
        BreadcrumbComponent,
        CollapsableTextComponent,
        TruncatePipe,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: ReportPaths.Details, redirectTo: '' }]),
        Angulartics2RouterlessModule.forRoot(),
        NoopAnimationsModule
      ],
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    anomalyService = TestBed.get(AnomalyService);
    reportService = TestBed.get(ReportService);
    reportService.currentReport = of(reportFixture);

    fixture = TestBed.createComponent(ProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {

    it('shoud request the user if the problem concerns an internet purchase or not', () => {
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(
        Object.assign(anomalyFixture, { withInternetPurchase: true })
      );

      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('h4').textContent).toEqual('Est-ce que votre problème fait suite à un achat sur internet ?');
      expect(nativeElement.querySelectorAll('button')[0].textContent).toEqual('Oui');
      expect(nativeElement.querySelectorAll('button')[1].textContent).toEqual('Non, pas sur internet');
      expect(nativeElement.querySelector('form')).toBeNull();
    });
  });

  describe('when problem does not concern an internet purchase', () => {

    it('should display subcategories', () => {
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(
        Object.assign(anomalyFixture, { withInternetPurchase: false })
      );

      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('app-subcategory')).not.toBeNull();
    });

  });

  describe('when receive subcategories', () => {

    it('should change the shared report with a report which contains subcategories', () => {
      reportFixture.internetPurchase = false;
      component.anomaly = new Anomaly();
      component.anomaly.subcategories = subcategoriesFixture;
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
      const changeReportSpy = spyOn(reportService, 'changeReportFromStep');
      fixture.detectChanges();

      component.onSelectSubcategories([subcategoriesFixture[1]]);

      const subcategoryExpected = new Subcategory();
      subcategoryExpected.title = 'title2';
      subcategoryExpected.description = 'description2';
      const reportExpected = new Report();
      reportExpected.internetPurchase = false;
      reportExpected.category = reportFixture.category;
      reportExpected.subcategories = [subcategoryExpected];

      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Subcategory);

    });
  });
});

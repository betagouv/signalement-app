import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemComponent } from './problem.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anomaly, Subcategory } from '../../../model/Anomaly';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DraftReport, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportPaths } from '../../../services/report-router.service';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { of } from 'rxjs';
import { genDraftReport } from '../../../../../test/fixtures.spec';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';

describe('ProblemComponent', () => {

  let component: ProblemComponent;
  let fixture: ComponentFixture<ProblemComponent>;
  let reportStorageService: ReportStorageService;
  let anomalyService: AnomalyService;

  const subcategoriesFixture = [
    Object.assign( new Subcategory(), { title: 'title1', description: 'description1' }),
    Object.assign( new Subcategory(), { title: 'title2', description: 'description2' }),
    Object.assign( new Subcategory(), {
      title: 'title3',
      description: 'description3',
      subcategories: [
        Object.assign( new Subcategory(), { title: 'title31', description: 'description31' }),
        Object.assign( new Subcategory(), { title: 'title32', description: 'description32' })
        ]
    }),
  ];

  const anomalyFixture = new Anomaly();
  anomalyFixture.subcategories = subcategoriesFixture;
  anomalyFixture.path = 'myPath';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProblemComponent,
        SubcategoryComponent,
        BreadcrumbComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: `myPath/${ReportPaths.Details}`, redirectTo: '' }]),
        NoopAnimationsModule,
        ComponentsModule,
        PipesModule,
      ],
      providers: [
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    anomalyService = TestBed.get(AnomalyService);
    reportStorageService = TestBed.get(ReportStorageService);
    fixture = TestBed.createComponent(ProblemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display subcategories', () => {
    spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(genDraftReport(Step.Category)));
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('app-subcategory')).not.toBeNull();
  });

  describe('when receive subcategories', () => {

    it('should change the shared report with a report which contains subcategories', () => {
      const draftReportInProgress = genDraftReport(Step.Category);
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));

      component.anomaly = new Anomaly();
      component.anomaly.subcategories = subcategoriesFixture;
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
      const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

      fixture.detectChanges();

      component.onSelectSubcategories([subcategoriesFixture[1]]);

      const subcategoryExpected = new Subcategory();
      subcategoryExpected.title = 'title2';
      subcategoryExpected.description = 'description2';
      const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
        subcategories: [subcategoryExpected]
      });

      expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Problem);

    });
  });
});

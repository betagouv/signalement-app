import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemComponent } from './problem.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anomaly, Subcategory } from '../../../model/Anomaly';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
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
import { AbTestsModule } from 'angular-ab-tests';
import { SVETestingScope, SVETestingVersions } from '../../../utils';

describe('ProblemComponent', () => {

  let component: ProblemComponent;
  let fixture: ComponentFixture<ProblemComponent>;
  let reportStorageService: ReportStorageService;
  let anomalyService: AnomalyService;

  const draftReportFixture = new DraftReport();
  draftReportFixture.category = 'catégorie';

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
  anomalyFixture.category = draftReportFixture.category;
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
        Angulartics2RouterlessModule.forRoot(),
        NoopAnimationsModule,
        ComponentsModule,
        PipesModule,
        AbTestsModule.forRoot(
          [
            {
              versions: [ SVETestingVersions.NoTest, SVETestingVersions.Test1 ],
              scope: SVETestingScope,
              weights: { [SVETestingVersions.NoTest]: 99, [SVETestingVersions.Test1]: 0 }
            }
          ]
        )
      ],
      providers: []
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
    spyOn(reportStorageService, 'retrieveReportInProgressFromStorage').and.returnValue(
      of(Object.assign(new DraftReport(), draftReportFixture))
    );
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('app-subcategory')).not.toBeNull();
  });

  describe('when receive subcategories', () => {

    it('should change the shared report with a report which contains subcategories', () => {
      const sharedReportFixture = Object.assign(new DraftReport(), draftReportFixture);
      reportStorageService.changeReportInProgress(sharedReportFixture);
      spyOn(reportStorageService, 'retrieveReportInProgressFromStorage').and.returnValue(of(sharedReportFixture));
      component.anomaly = new Anomaly();
      component.anomaly.subcategories = subcategoriesFixture;
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
      const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

      fixture.detectChanges();

      component.onSelectSubcategories([subcategoriesFixture[1]]);

      const subcategoryExpected = new Subcategory();
      subcategoryExpected.title = 'title2';
      subcategoryExpected.description = 'description2';
      const draftReportExpected = new DraftReport();
      draftReportExpected.category = sharedReportFixture.category;
      draftReportExpected.subcategories = [subcategoryExpected];

      expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Problem);

    });
  });
});

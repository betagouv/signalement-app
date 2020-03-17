import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemComponent } from './problem.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anomaly, Subcategory } from '../../../model/Anomaly';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Report, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportPaths } from '../../../services/report-router.service';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { of } from 'rxjs';
import { AutofocusDirective } from '../../../directives/auto-focus.directive';

describe('ProblemComponent', () => {

  let component: ProblemComponent;
  let fixture: ComponentFixture<ProblemComponent>;
  let reportStorageService: ReportStorageService;
  let anomalyService: AnomalyService;

  const reportFixture = new Report();
  reportFixture.category = 'catégorie';

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
  anomalyFixture.category = reportFixture.category;
  anomalyFixture.subcategories = subcategoriesFixture;
  anomalyFixture.path = 'myPath';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProblemComponent,
        SubcategoryComponent,
        BreadcrumbComponent,
        AutofocusDirective,
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

  describe('on init', () => {

    it('shoud request the user if the problem concerns an internet purchase or not', () => {
      spyOn(reportStorageService, 'retrieveReportInProgressFromStorage').and.returnValue(of(Object.assign(new Report(), reportFixture)));
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(
        Object.assign(anomalyFixture, { withInternetPurchase: true })
      );

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('h2').textContent).toEqual('Est-ce que votre problème fait suite à un achat sur internet ?');
      expect(nativeElement.querySelectorAll('button')[0].textContent).toEqual('Oui');
      expect(nativeElement.querySelectorAll('button')[1].textContent).toEqual('Non, pas sur internet');
      expect(nativeElement.querySelector('form')).toBeNull();
    });
  });

  describe('when problem does not concern an internet purchase', () => {

    it('should display subcategories', () => {
      spyOn(reportStorageService, 'retrieveReportInProgressFromStorage').and.returnValue(of(Object.assign(new Report(), reportFixture)));
      spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(
        Object.assign(anomalyFixture, { withInternetPurchase: false })
      );

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('app-subcategory')).not.toBeNull();
    });

  });

  describe('when receive subcategories', () => {

    it('should change the shared report with a report which contains subcategories', () => {
      const sharedReportFixture = Object.assign(new Report(), reportFixture, {internetPurchase: false});
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
      const reportExpected = new Report();
      reportExpected.internetPurchase = false;
      reportExpected.category = sharedReportFixture.category;
      reportExpected.subcategories = [subcategoryExpected];

      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Problem);

    });
  });
});

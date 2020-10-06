import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemComponent } from './problem.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anomaly, ContractualDisputeTag, Subcategory, Tag } from '../../../model/Anomaly';
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
import { genDraftReport, genInformation, genSubcategory } from '../../../../../test/fixtures.spec';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';

const randomstring = require('randomstring');

describe('ProblemComponent', () => {

  let component: ProblemComponent;
  let fixture: ComponentFixture<ProblemComponent>;
  let reportStorageService: ReportStorageService;
  let anomalyService: AnomalyService;

  const subcategoriesFixture = [
    genSubcategory(),
    <Subcategory>{
      ...genSubcategory(),
      tags: [ContractualDisputeTag]
    },
    <Subcategory>{
      ...genSubcategory(),
      subcategories: [
        genSubcategory(),
        genSubcategory()
      ]
    }
  ];

  const anomalyFixture = new Anomaly();
  anomalyFixture.subcategories = subcategoriesFixture;
  anomalyFixture.path = 'myPath';

  const draftReportInProgress = genDraftReport(Step.Category);

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

    spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display subcategories', () => {
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('app-subcategory')).not.toBeNull();
  });

  it('should request the user if he is an employee of the company or not when receive subcategories', () => {

    component.anomaly = new Anomaly();
    component.anomaly.subcategories = subcategoriesFixture;
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
    fixture.detectChanges();

    component.onSelectSubcategories([subcategoriesFixture[0]]);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('h2').textContent).toEqual(`Travaillez-vous dans l'entreprise que vous souhaitez signaler ?`);
    expect(nativeElement.querySelectorAll('button')[0].textContent.trim()).toEqual('Oui');
    expect(nativeElement.querySelectorAll('button')[1].textContent.trim()).toEqual('Non, je n\'y travaille pas');
    expect(nativeElement.querySelector('form')).toBeNull();
  });

  it('should update the shared report when the user is an employee', () => {

    const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

    component.anomaly = new Anomaly();
    component.anomaly.subcategories = subcategoriesFixture;
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
    fixture.detectChanges();

    component.onSelectSubcategories([subcategoriesFixture[0]]);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('button')[0].click();
    fixture.detectChanges();

    const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
      subcategories: [subcategoriesFixture[0]],
      employeeConsumer: true
    });

    expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Problem);

  });

  it('should update the shared report when the user is not employee and report does not concern a contractual report', () => {

    const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

    component.anomaly = new Anomaly();
    component.anomaly.subcategories = subcategoriesFixture;
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
    fixture.detectChanges();

    component.onSelectSubcategories([subcategoriesFixture[0]]);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('button')[1].click();
    fixture.detectChanges();

    const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
      subcategories: [subcategoriesFixture[0]],
      employeeConsumer: false
    });

    expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Problem);

  });

  it('should display specific message when the user is not employee and report concerns a contractual report', () => {

    const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

    component.anomaly = new Anomaly();
    component.anomaly.subcategories = subcategoriesFixture;
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
    fixture.detectChanges();

    component.onSelectSubcategories([subcategoriesFixture[1]]);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('button')[1].click();
    fixture.detectChanges();

    expect(changeReportSpy).not.toHaveBeenCalled();
    expect(nativeElement.querySelector('#contractualDisputeMessage')).not.toBeNull();

  });

  it('should update the shared report when the contractual message is submitted', () => {

    const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');

    component.anomaly = new Anomaly();
    component.anomaly.subcategories = subcategoriesFixture;
    spyOn(anomalyService, 'getAnomalyByCategory').and.returnValue(anomalyFixture);
    fixture.detectChanges();

    component.onSelectSubcategories([subcategoriesFixture[1]]);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('button')[1].click();
    fixture.detectChanges();

    nativeElement.querySelectorAll('button')[0].click();
    fixture.detectChanges();

    const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
      subcategories: [subcategoriesFixture[1]],
      employeeConsumer: false
    });

    expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Problem);

  });

});

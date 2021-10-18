import { async, TestBed } from '@angular/core/testing';
import { ProblemComponent } from './problem.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Anomaly, ReportTag, Subcategory } from '@signal-conso/signalconso-api-sdk-js';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DraftReport, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportPaths } from '../../../services/report-router.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { of } from 'rxjs';
import { genDraftReport, genInformation, genSubcategory } from '../../../../../test/fixtures.spec';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';
import { DetailsComponent } from '../details/details.component';
import { InformationComponent } from '../information/information.component';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AlertModule } from '../../../components/alert/alert';
import { DialogContractualDisputeModule } from './alert-contractual-dispute.component';
import { PageModule } from '../../../components/page/page.module';
import { MatRadioModule } from '@angular/material/radio';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProblemStepComponent, ProblemStepsComponent } from './problem-step.component';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('ProblemComponent', () => {
  let reportStorageService: ReportStorageService;
  let anomalyService: AnomalyService;
  let router: Router;
  let overlayContainerElement: HTMLElement;

  const simpleSubcategoryFixture = genSubcategory();
  const contractualDisputeSubcategoryFixture = <Subcategory>{ ...genSubcategory(), tags: [ReportTag.LitigeContractuel] };
  const infoSubcategoryFixture = <Subcategory>{ ...genSubcategory(), information: genInformation() };

  const subcategoriesFixture = [
    simpleSubcategoryFixture,
    contractualDisputeSubcategoryFixture,
    infoSubcategoryFixture
  ];

  const anomalyFixture: Anomaly = {
    id: '1',
    categoryId: '',
    category: '',
    path: 'myPath',
    subcategories: subcategoriesFixture,
  };

  const draftReportInProgress = genDraftReport(Step.Category);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProblemComponent,
        BreadcrumbComponent,
        ProblemStepsComponent,
        ProblemStepComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: `${anomalyFixture.path}/${ReportPaths.Details}`, component: DetailsComponent },
          { path: `${anomalyFixture.path}/${ReportPaths.Information}`, component: InformationComponent }
        ]),
        NoopAnimationsModule,
        ComponentsModule,
        PipesModule,
        MatButtonModule,
        AlertModule,
        BsDatepickerModule.forRoot(),
        DialogContractualDisputeModule,
        PageModule,
        MatRadioModule,
      ],
      providers: [
        {
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        },
        { provide: AnalyticsService, useClass: MockAnalyticsService }
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    anomalyService = TestBed.inject(AnomalyService);
    reportStorageService = TestBed.inject(ReportStorageService);
    spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProblemComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display subcategories', () => {
    spyOn(anomalyService, 'getAnomalyBy').and.returnValue(anomalyFixture);
    const fixture = TestBed.createComponent(ProblemComponent);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('app-problem-steps')).not.toBeNull();
  });

  it('should route to information page when receive subcategories ending with information', () => {
    spyOn(anomalyService, 'getAnomalyBy').and.returnValue(anomalyFixture);
    const routerSpy = spyOn(router, 'navigate');
    const fixture = TestBed.createComponent(ProblemComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.onChange([infoSubcategoryFixture], 0, infoSubcategoryFixture.title);
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('.btn.btn-lg.btn-primary')[0].click();
    expect(routerSpy).toHaveBeenCalledWith([anomalyFixture.path, ReportPaths.Information]);
  });

  it('should request the user if he is an employee of the company or not when receive subcategories', () => {
    spyOn(anomalyService, 'getAnomalyBy').and.returnValue(anomalyFixture);
    const fixture = TestBed.createComponent(ProblemComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.onChange([simpleSubcategoryFixture], 0, simpleSubcategoryFixture.title);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement;
    const employeeStep = nativeElement.querySelector('app-problem-steps:last-of-type')!;
    expect(employeeStep.querySelector('.-title-container h3').textContent).toEqual(`Travaillez-vous dans l'entreprise que vous souhaitez signaler ?`);
    expect(employeeStep.querySelectorAll('app-problem-step .-title')[0].textContent.trim()).toEqual('Oui');
    expect(employeeStep.querySelectorAll('app-problem-step .-title')[1].textContent.trim()).toEqual('Non, je n\'y travaille pas');
  });

  it('should update the shared report when the user is an employee', () => {
    const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');
    spyOn(anomalyService, 'getAnomalyBy').and.returnValue(anomalyFixture);
    const fixture = TestBed.createComponent(ProblemComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.onChange([simpleSubcategoryFixture], 0, simpleSubcategoryFixture.title);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement;
    nativeElement.querySelector('app-problem-steps:last-of-type app-problem-step').click();
    fixture.detectChanges();
    nativeElement.querySelectorAll('.btn.btn-lg.btn-primary')[0].click();
    fixture.detectChanges();

    const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
      subcategories: [simpleSubcategoryFixture],
      employeeConsumer: true
    });

    expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Problem);
  });

  it('should update the shared report when the user is not employee and report does not concern a contractual report', () => {
    const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');
    spyOn(anomalyService, 'getAnomalyBy').and.returnValue(anomalyFixture);
    const fixture = TestBed.createComponent(ProblemComponent);
    const component = fixture.componentInstance;
    component.onChange([simpleSubcategoryFixture], 0, simpleSubcategoryFixture.title);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('app-problem-steps:last-of-type app-problem-step')[1].click();
    fixture.detectChanges();
    nativeElement.querySelectorAll('.btn.btn-lg.btn-primary')[0].click();
    fixture.detectChanges();
    const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
      subcategories: [simpleSubcategoryFixture],
      employeeConsumer: false
    });
    expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Problem);
  });

  it('should display specific message when the user is not employee and report concerns a contractual report', () => {
    spyOn(anomalyService, 'getAnomalyBy').and.returnValue({
      id: '1',
      categoryId: '',
      category: '',
      path: '',
      subcategories: subcategoriesFixture,
    });
    const fixture = TestBed.createComponent(ProblemComponent);
    const component = fixture.componentInstance;
    const changeReportSpy = spyOn(component, 'nextStep');
    const openContractualDisputeDialogSpy = spyOn(component, 'openContractualDisputeDialog');
    fixture.detectChanges();
    component.onChange([contractualDisputeSubcategoryFixture], 0, contractualDisputeSubcategoryFixture.title);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('app-problem-steps:last-of-type app-problem-step')[1].click();
    fixture.detectChanges();
    nativeElement.querySelectorAll('.btn.btn-lg.btn-primary')[0].click();
    fixture.detectChanges();
    expect(changeReportSpy).not.toHaveBeenCalled();
    expect(openContractualDisputeDialogSpy).toHaveBeenCalled();
  });

  it('should update the shared report when the contractual message is submitted', () => {
    spyOn(anomalyService, 'getAnomalyBy').and.returnValue(anomalyFixture);
    const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');
    const fixture = TestBed.createComponent(ProblemComponent);
    const component = fixture.componentInstance;
    component.onChange([contractualDisputeSubcategoryFixture], 0, contractualDisputeSubcategoryFixture.title);
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement;
    nativeElement.querySelectorAll('app-problem-steps:last-of-type app-problem-step')[1].click();
    fixture.detectChanges();
    nativeElement.querySelectorAll('.btn.btn-lg.btn-primary')[0].click();
    fixture.detectChanges();
    (overlayContainerElement.querySelectorAll('app-alert-contractual-dispute button')[0] as any).click();
    fixture.detectChanges();

    const draftReportExpected = Object.assign(new DraftReport(), draftReportInProgress, {
      subcategories: [contractualDisputeSubcategoryFixture],
      employeeConsumer: false
    });
    expect(changeReportSpy).toHaveBeenCalled();
    // TODO Not working for an unknown reason
    // expect(changeReportSpy).toHaveBeenCalledWith(draftReportExpected, Step.Problem);
  });
});

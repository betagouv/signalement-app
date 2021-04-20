import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Anomaly, instanceOfSubcategoryInformation, Subcategory } from '../../../model/Anomaly';
import { AnomalyService } from '../../../services/anomaly.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

enum ProblemSteps {
  Subcategories = 'Subcategories',
  EmployeeConsumer = 'EmployeeConsumer',
  ContractualDispute = 'ContractualDispute',
  ReponseConso = 'ReponseConso',
  Next = 'Next',
}

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {

  readonly form = new FormGroup({
    employeeConsumer: new FormControl(),
    forwardToReponseConso: new FormControl(),
  });

  step: Step;
  draftReport: DraftReport;
  anomaly: Anomaly;
  problemStep = ProblemSteps.Subcategories;
  problemSteps = ProblemSteps;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
    public formBuilder: FormBuilder,
    private anomalyService: AnomalyService,
    private reportStorageService: ReportStorageService,
    private reportRouterService: ReportRouterService,
    private analyticsService: AnalyticsService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta) { }

  ngOnInit() {

    this.step = Step.Problem;

    this.activatedRoute.url.pipe(
      take(1),
      switchMap(
        url => {
          const anomaly = this.anomalyService.getAnomalyBy(a => a.path === url[0].path);
          if (anomaly && !url[1]) {
            this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
            this.draftReport = new DraftReport();
            this.draftReport.category = anomaly.category;
            this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
            this.titleService.setTitle(`${anomaly.category} - SignalConso`);
            this.meta.updateTag({ name: 'description', content: anomaly.description });
          }
          return this.reportStorageService.retrieveReportInProgress();
        }
      ),
      take(1),
    ).subscribe(report => {
      if (report && report.category) {
        this.draftReport = report;
        this.initAnomalyFromReport();
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  initAnomalyFromReport() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.draftReport.category);
    if (anomaly && anomaly.subcategories) {
      this.anomaly = anomaly;
    }
  }

  onSelectSubcategories(subcategories: Subcategory[]) {
    console.log('onSelectSubcategories', subcategories);
    this.analyticsService.trackEvent(
      EventCategories.report,
      ReportEventActions.validateSubcategory,
      subcategories.map(subcategory => subcategory.title)
    );
    this.analyticsService.trackEvent(
      EventCategories.report,
      ReportEventActions.contactualReport,
      this.draftReport.isContractualDispute ? 'Oui' : 'Non'
    );
    this.draftReport.subcategories = subcategories;
    this.continue();
  }

  continue(value?: boolean) {
    switch (this.problemStep) {
      case ProblemSteps.Subcategories: {
        if (instanceOfSubcategoryInformation(this.draftReport.lastSubcategory)) {
          this.problemStep = ProblemSteps.ReponseConso;
          this.continue();
        } else {
          this.problemStep = ProblemSteps.EmployeeConsumer;
          this.scollTop();
        }
        break;
      }
      case ProblemSteps.EmployeeConsumer: {
        this.analyticsService.trackEvent(EventCategories.report, value ? ReportEventActions.employee : ReportEventActions.notEmployee);
        this.draftReport.employeeConsumer = value;
        if (this.draftReport.isContractualDispute) {
          this.problemStep = ProblemSteps.ContractualDispute;
          this.scollTop();
        } else if (value) {
          this.problemStep = ProblemSteps.Next;
          this.continue();
        } else {
          this.problemStep = ProblemSteps.ReponseConso;
        }
        break;
      }
      case ProblemSteps.ReponseConso: {
        this.draftReport.forwardToReponseConso = value;
        this.continue();
        break;
      }
      default: {
        this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
        this.reportRouterService.routeForward(this.step);
        break;
      }
    }
  }

  scollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
  }
}


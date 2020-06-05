import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Anomaly, Subcategory } from '../../../model/Anomaly';
import { AnomalyService } from '../../../services/anomaly.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { SVETestingScope, SVETestingVersions } from '../../../utils';
import { AbTestsService } from 'angular-ab-tests';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {

  step: Step;
  draftReport: DraftReport;
  anomaly: Anomaly;

  showErrors: boolean;

  continueReport: boolean;
  stopReportChoice: boolean;
  stopReportCause: string;
  stopReportOtherCauseDetail: string;
  stopReportCauses = StopReportCauses;

  constructor(public formBuilder: FormBuilder,
              private anomalyService: AnomalyService,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private meta: Meta,
              private abTestsService: AbTestsService) { }

  ngOnInit() {

    if (this.abTestsService.getVersion(SVETestingScope) === SVETestingVersions.Test1) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.requestUserToContinueReport);
    } else {
      this.continueReport = true;
    }

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
    this.analyticsService.trackEvent(
      EventCategories.report,
      ReportEventActions.validateSubcategory,
      subcategories.map(subcategory => subcategory.title)
    );
    this.analyticsService.trackEvent(
      EventCategories.report,
      ReportEventActions.contactualReport,
      subcategories[subcategories.length - 1].consumerActions ? 'Oui' : 'Non'
    );
    this.draftReport.subcategories = subcategories;
    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  handleStopReportChoice() {
    if (this.stopReportChoice) {
      this.analyticsService.trackEvent(
        EventCategories.report,
        ReportEventActions.stopReport,
        `${this.stopReportCause}${this.stopReportCause === this.stopReportCauses.Others ? ': '.concat(this.stopReportOtherCauseDetail) : ''}`
      );
      window.location.href = 'https://www.economie.gouv.fr/contact/contacter-la-dgccrf?dest=particulier';
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.continueReport);
      this.continueReport = true;
    }
  }
}

export enum StopReportCauses {
  Fear = 'Peur des représailles', Penalty = 'Souhait sanction uniquement', Others = 'Autre'
}


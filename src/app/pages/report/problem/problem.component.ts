import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Anomaly, Subcategory } from '../../../model/Anomaly';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportService } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Report } from '../../../model/Report';
import { ReportRouterService, Step } from '../../../services/report-router.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {

  step: Step;
  report: Report;
  anomaly: Anomaly;

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder,
            private anomalyService: AnomalyService,
            private reportService: ReportService,
            private reportRouterService: ReportRouterService,
            private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Subcategory;
    this.reportService.currentReport.subscribe(report => {
      if (report && report.category) {
        this.report = report;
        this.initAnomalyFromReport();
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  initAnomalyFromReport() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
    if (anomaly && anomaly.subcategories) {
      this.anomaly = anomaly;
    }
  }

  onSelectSubcategories(subcategories: Subcategory[]) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateSubcategory, subcategories);
    this.report.subcategories = subcategories;
    this.reportService.changeReportFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  setInternetPurchase(internetPurchase: boolean) {
    this.report.internetPurchase = internetPurchase;
    if (this.report.internetPurchase) {
      this.report.category = 'Problème suite à un achat sur internet';
      this.reportService.changeReportFromStep(this.report, Step.Category);
      this.reportRouterService.routeForward(Step.Category);
    }
  }
}

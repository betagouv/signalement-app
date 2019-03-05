import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Anomaly } from '../../../model/Anomaly';
import { Report } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService, Step } from '../../../services/report-router.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  step: Step;
  report: Report;

  anomalies: Anomaly[];
  showSecondaryCategories: boolean;

  constructor(private anomalyService: AnomalyService,
              private reportService: ReportService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Category;
    this.reportService.currentReport.subscribe(report => this.report = report);

    this.showSecondaryCategories = false;
    this.loadAnomalies();
  }

  loadAnomalies() {
    this.anomalies = this.anomalyService.getAnomalies();
  }

  primaryCategoriesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies
        .filter(a => a.rank < 100)
        .sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  secondaryCategoriesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies
        .filter(a => a.rank >= 100)
        .sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  displaySecondaryCategories() {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.secondaryCategories);
    this.showSecondaryCategories = true;
  }

  selectAnomaly(anomaly: Anomaly) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
    this.report = new Report();
    this.report.category = anomaly.category;
    this.reportService.changeReportFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }
  
  restoreStoredReport() {
    this.reportService.changeReportFromStep(this.report, this.report.storedStep);
    this.reportRouterService.routeForward(this.report.storedStep);
  }

  removeStoredReport() {
    this.reportService.removeReportFromStorage();
  }

}

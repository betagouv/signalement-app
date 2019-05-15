import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnomalyService } from '../../../services/anomaly.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Information } from '../../../model/Anomaly';
import { Report } from '../../../model/Report';
import { ReportRouterService, Step } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy {

  step: Step;
  report: Report;

  informationToDisplay: Information;

  constructor(private reportStorageService: ReportStorageService,
    private reportRouterService: ReportRouterService,
    private anomalyService: AnomalyService,
    private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Information;
    this.reportStorageService.reportInProgess.subscribe(report => {
      if (report) {
        this.report = report;
        this.initInformation();
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  initInformation() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
    if (anomaly && anomaly.information) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.outOfBounds, anomaly.category);
      this.informationToDisplay = anomaly.information;
    } else if (this.report.subcategories && this.getReportLastSubcategory().information) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.outOfBounds, this.getReportLastSubcategory().title);
      this.informationToDisplay = this.getReportLastSubcategory().information;
    }
  }

  newReport() {
    this.reportStorageService.removeReportInProgress();
    this.reportRouterService.routeToFirstStep();
  }

  ngOnDestroy() {
    this.reportRouterService.routeBackward(this.step);
  }

  getReportLastSubcategory() {
    if (this.report && this.report.subcategories && this.report.subcategories.length) {
      return this.report.subcategories[this.report.subcategories.length - 1];
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportService } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Information } from '../../../model/Anomaly';
import { Report } from '../../../model/Report';
import { ReportRouterService, Step } from '../../../services/report-router.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {

  step: Step;
  report: Report;

  informationToDisplay: Information;

  constructor(private reportService: ReportService,
              private reportRouterService: ReportRouterService,
              private anomalyService: AnomalyService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Information;
    this.reportService.currentReport.subscribe(report => {
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
    } else if (this.report.subcategories && this.report.lastSubcategory.information) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.outOfBounds, this.report.lastSubcategory.title);
      this.informationToDisplay = this.report.lastSubcategory.information;
    }
  }

  newReport() {
    this.reportService.changeReportFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }

}

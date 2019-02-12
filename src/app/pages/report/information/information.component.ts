import { Component, OnInit } from '@angular/core';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportService, Step } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Information } from '../../../model/Anomaly';
import { Report } from '../../../model/Report';

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
              private anomalyService: AnomalyService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Information;
    this.reportService.currentReport.subscribe(report => {
      if (report) {
        this.report = report;
        this.initInformation();
      } else {
        this.reportService.reinit();
      }
    });
  }

  initInformation() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
    if (anomaly.information) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.outOfBounds, anomaly.category);
      this.informationToDisplay = anomaly.information;
    } else if (this.report.subcategory && this.report.subcategory.information) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.outOfBounds, this.report.subcategory.title);
      this.informationToDisplay = this.report.subcategory.information;
    }
  }

  newReport() {
    this.reportService.changeReport(this.report, this.step);
  }

}

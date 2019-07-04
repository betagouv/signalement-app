import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnomalyService } from '../../../services/anomaly.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Information } from '../../../model/Anomaly';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Report, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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
              private analyticsService: AnalyticsService,
              private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.step = Step.Information;

    this.activatedRoute.url.pipe(
      switchMap(
        url => {
          const anomaly = this.anomalyService.getAnomalyBy(a => a.path === url[0].path)
          if (anomaly) {
            this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
            this.report = new Report();
            this.report.category = anomaly.category;
            this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
          }
          return this.reportStorageService.reportInProgess;
        }
      )
    ).subscribe(report => {
      console.log('report', report)
      if (report) {
        this.report = report;
        this.initInformation();
        this.reportStorageService.removeReportInProgressFromStorage();
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  initInformation() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
    console.log('anomaly', anomaly)
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

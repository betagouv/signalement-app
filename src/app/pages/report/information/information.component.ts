import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnomalyService } from '../../../services/anomaly.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Information } from '../../../model/Anomaly';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Report, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { RatingService } from '../../../services/rating.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  step: Step;
  report: Report;

  informationToDisplay: Information;
  loading: boolean;
  loadingError: boolean;
  ratingSuccess: boolean;

  constructor(private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private anomalyService: AnomalyService,
              private analyticsService: AnalyticsService,
              private ratingService: RatingService,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.step = Step.Information;

    this.activatedRoute.url.pipe(
      takeUntil(this.unsubscribe),
      switchMap(
        url => {
          const anomaly = this.anomalyService.getAnomalyBy(a => a.path === url[0].path);
          if (anomaly && !url[1]) {
            this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
            this.report = new Report();
            this.report.category = anomaly.category;
            this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
            this.titleService.setTitle(`${anomaly.category} - SignalConso`);
            this.meta.updateTag({ name: 'description', content: anomaly.description });
          }
          return this.reportStorageService.reportInProgess;
        }
      )
    ).subscribe(report => {
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
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getReportLastSubcategory() {
    if (this.report && this.report.subcategories && this.report.subcategories.length) {
      return this.report.subcategories[this.report.subcategories.length - 1];
    }
  }

  rateInformation(positive: boolean) {
    this.loading = true;
    this.loadingError = false;
    this.ratingService.rate(this.report.category, this.report.subcategories, positive).subscribe(
      _ => {
        this.loading = false;
        this.ratingSuccess = true;
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      }
    );
  }

}

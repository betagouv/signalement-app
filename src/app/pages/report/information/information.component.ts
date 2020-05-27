import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnomalyService } from '../../../services/anomaly.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Anomaly, Information } from '../../../model/Anomaly';
import { ReportStorageService } from '../../../services/report-storage.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { switchMap, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { RatingService } from '../../../services/rating.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy {

  step: Step;
  draftReport: DraftReport;

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
      take(1),
      switchMap(url => {
        const anomaly = this.anomalyService.getAnomalyBy(a => a.path === url[0].path);
        if (anomaly && !url[1]) {
          return of(this.initFromAnomaly(anomaly));
        } else {
          return this.reportStorageService.retrieveReportInProgress();
        }
      }),
    ).subscribe(report => {
      if (report) {
        this.draftReport = report;
        this.initInformation();
        this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  initFromAnomaly(anomaly: Anomaly) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
    this.titleService.setTitle(`${anomaly.category} - SignalConso`);
    this.meta.updateTag({ name: 'description', content: anomaly.description });
    return Object.assign(new DraftReport(), {category: anomaly.category});
  }

  initInformation() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.draftReport.category);
    if (anomaly && anomaly.information) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.outOfBounds, anomaly.category);
      this.informationToDisplay = anomaly.information;
    } else if (this.getReportLastSubcategory() && this.getReportLastSubcategory().information) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.outOfBounds, this.getReportLastSubcategory().title);
      this.informationToDisplay = this.getReportLastSubcategory().information;
    }
  }

  newReport() {
    this.reportRouterService.routeToFirstStep();
  }

  ngOnDestroy() {
    this.reportRouterService.routeBackward(this.step);
  }

  getReportLastSubcategory() {
    if (this.draftReport && this.draftReport.subcategories && this.draftReport.subcategories.length) {
      return this.draftReport.subcategories[this.draftReport.subcategories.length - 1];
    }
  }

  rateInformation(positive: boolean) {
    this.loading = true;
    this.loadingError = false;
    this.ratingService.rate(this.draftReport.category, this.draftReport.subcategories, positive).subscribe(
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Anomaly, Subcategory } from '../../../model/Anomaly';
import { AnomalyService } from '../../../services/anomaly.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Report, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  step: Step;
  report: Report;
  anomaly: Anomaly;

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder,
            private anomalyService: AnomalyService,
            private reportStorageService: ReportStorageService,
            private reportRouterService: ReportRouterService,
            private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Problem;
    this.reportStorageService.reportInProgess
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(report => {
        if (report && report.category) {
          this.report = report;
          this.initAnomalyFromReport();
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initAnomalyFromReport() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
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
    this.report.subcategories = subcategories;
    this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  setInternetPurchase(internetPurchase: boolean) {
    this.report.internetPurchase = internetPurchase;
    if (this.report.internetPurchase) {
      this.report.category = this.anomalyService.getAnomalyByCategoryId('INTERNET').category;
      this.reportStorageService.changeReportInProgressFromStep(this.report, Step.Category);
      this.reportRouterService.routeForward(Step.Category);
    }
  }
}

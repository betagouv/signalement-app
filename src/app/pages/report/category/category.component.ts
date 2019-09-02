import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Anomaly, Information } from '../../../model/Anomaly';
import { Report, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Utils from '../../../utils';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  step: Step;
  report: Report;

  anomalies: Anomaly[];
  showSecondaryCategories: boolean;

  internetInformation: Information;

  constructor(private anomalyService: AnomalyService,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Category;
    this.reportStorageService.reportInProgess
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(report => this.report = report);
    this.showSecondaryCategories = false;
    this.anomalies = this.anomalyService.getAnomalies();
    const anomaly = this.anomalyService.getAnomalyByCategoryId('INTERNET');
    if (anomaly) {
      this.internetInformation = anomaly.information;
    }

    Utils.focusAndBlurOnTop();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
        .filter(a => !a.hidden)
        .sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  toggleSecondaryCategories() {
    this.showSecondaryCategories = !this.showSecondaryCategories;
    if (this.showSecondaryCategories) {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.secondaryCategories);
    }

  }

  selectAnomaly(anomaly: Anomaly) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
    this.report = new Report();
    this.report.category = anomaly.category;
    this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  restoreStoredReport() {
    this.reportStorageService.changeReportInProgressFromStep(this.report, this.report.storedStep);
    this.reportRouterService.routeForward(this.report.storedStep);
  }

  removeStoredReport() {
    this.reportStorageService.removeReportInProgressFromStorage();
  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}

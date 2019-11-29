import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Anomaly, Information } from '../../../model/Anomaly';
import { Report, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Utils from '../../../utils';
import pages from '../../../../assets/data/pages.json';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  step: Step;
  report: Report;

  anomalies: Anomaly[];
  showSecondaryCategories: boolean;

  internetInformation: Information;

  illustrations = [
    { title: 'Vous avez rencontré un problème avec une entreprise&#160;?', picture: 'picture-problem.svg' },
    { title: 'Faites un signalement avec SignalConso.', picture: 'picture-alert.svg' },
    { title: "L'entreprise est prévenue et peut intervenir.", picture: 'picture-pro.svg' },
    { title: 'La répression des fraudes intervient si c’est nécessaire.', picture: 'picture-inspect.svg' },
  ]

  constructor(private titleService: Title,
              private meta: Meta,
              private anomalyService: AnomalyService,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.default.title);
    this.meta.updateTag({ name: 'description', content: pages.default.description });

    this.step = Step.Category;
    this.reportStorageService.retrieveReportInProgressFromStorage()
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
    $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
}


@Component({
  selector: 'app-illustration-card',
  template: `
    <div class="card">
      <div class="card-body">
        <h6 class="card-title" [innerHTML]="illustration.title"></h6>
      </div>
      <img src="/assets/images/{{illustration.picture}}" class="card-img-bottom" alt="Illustration" />
    </div>
  `,
})
export class IllustrationCardComponent {

  @Input() illustration: { title: string, picture: string };

}

import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Anomaly, Information } from '../../../model/Anomaly';
import { Report, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';
import pages from '../../../../assets/data/pages.json';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  illustrations = Illustrations;

  step: Step;
  report: Report;

  anomalies: Anomaly[];
  showSecondaryCategories: boolean;

  internetInformation: Information;

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
      .pipe(take(1))
      .subscribe(report => this.report = report);
    this.showSecondaryCategories = false;
    this.anomalies = this.anomalyService.getAnomalies();
    const anomaly = this.anomalyService.getAnomalyByCategoryId('INTERNET');
    if (anomaly) {
      this.internetInformation = anomaly.information;
    }
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


export const Illustrations = [
  { title: 'Vous avez rencontré un problème<br/>avec une entreprise&#160;?', picture: 'picture-problem.svg' },
  { title: 'Faites un signalement<br/>avec SignalConso.', picture: 'picture-alert.svg' },
  { title: `L'entreprise est prévenue<br/>et peut intervenir.`, picture: 'picture-pro.svg' },
  { title: 'La répression des fraudes intervient<br/>si c’est nécessaire.', picture: 'picture-inspect.svg' },
]

@Component({
  selector: 'app-illustration-card',
  template: `
    <div class="card" [ngClass]="firstCard ?'first-card' : lastCard ? 'last-card' : ''">
      <img src="/assets/images/{{illustration.picture}}" class="card-img-top" alt="Illustration" />
      <div class="card-body">
        <div class="card-title" [innerHTML]="illustration.title"></div>
      </div>
    </div>
  `,
  styleUrls: ['./category.component.scss']
})
export class IllustrationCardComponent {

  @Input() illustration: { title: string, picture: string };
  @Input() firstCard = false;
  @Input() lastCard = false;

}

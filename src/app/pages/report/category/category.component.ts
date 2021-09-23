import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Anomaly, Information, instanceOfSubcategoryInformation } from '../../../model/Anomaly';
import { DraftReport, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';
import { pageDefinitions } from '../../../../assets/data/pages';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  illustrations = Illustrations;

  step: Step;
  draftReport: DraftReport;

  anomalies: Anomaly[];

  internetInformation: Information;

  constructor(private titleService: Title,
              private meta: Meta,
              private anomalyService: AnomalyService,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.titleService.setTitle(pageDefinitions.default.title);
    this.meta.updateTag({ name: 'description', content: pageDefinitions.default.description });

    this.step = Step.Category;
    this.reportStorageService.retrieveReportInProgress()
      .pipe(take(1))
      .subscribe(draftReport => this.draftReport = draftReport);
    this.anomalies = this.anomalyService.getAnomalies();
    const anomaly = this.anomalyService.getAnomalyByCategoryId('INTERNET');
    if (anomaly) {
      this.internetInformation = anomaly.information;
    }
  }

  getCategoriesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies
        .filter(a => !a.hidden)
        .sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  selectAnomaly(anomaly: Anomaly) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
    this.draftReport = new DraftReport();
    this.draftReport.category = anomaly.category;
    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  restoreStoredReport() {
    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.draftReport.storedStep);
    this.reportRouterService.routeForward(this.draftReport.storedStep);
  }

  removeStoredReport() {
    this.reportStorageService.removeReportInProgress();
    this.draftReport = undefined;
  }

  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  isAlertOpen() {
    return this.draftReport && this.draftReport.subcategories && !instanceOfSubcategoryInformation(this.draftReport.lastSubcategory);
  }
}


export const Illustrations = [
  { title: 'Vous avez rencontré un problème<br/>avec une entreprise&#160;?', picture: 'illustrations/consumer.png' },
  { title: 'Faites un signalement<br/>avec SignalConso.', picture: 'illustrations/report.png' },
  { title: `L'entreprise est prévenue<br/>et peut intervenir.`, picture: 'illustrations/company.png' },
  { title: 'La répression des fraudes intervient si nécessaire.', picture: 'illustrations/dgccrf.png' },
];

@Component({
  selector: 'app-illustration-card',
  template: `
    <div class="card d-block" [ngClass]="firstCard ?'first-card' : lastCard ? 'last-card' : ''">
      <img src="/assets/images/{{illustration.picture}}" class="card-img-top" alt="" loading="lazy"/>
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

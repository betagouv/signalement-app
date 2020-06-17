import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportStorageService } from '../../../services/report-storage.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { take } from 'rxjs/operators';
import { CompanyKinds } from '../../../model/Anomaly';
import { AbTestsService } from 'angular-ab-tests';
import { SVETestingScope, SVETestingVersions } from '../../../utils';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';

@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.scss']
})
export class AcknowledgmentComponent implements OnInit, OnDestroy {

  step: Step;
  draftReport: DraftReport;
  companyKinds = CompanyKinds;

  constructor(private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private abTestsService: AbTestsService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Acknowledgment;
    this.reportStorageService.retrieveReportInProgress()
      .pipe(take(1))
      .subscribe(draftReport => {
        if (draftReport) {
          this.draftReport = draftReport;
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });

    if (this.abTestsService.getVersion(SVETestingScope) && this.abTestsService.getVersion(SVETestingScope) !== SVETestingVersions.NoTest) {
      this.analyticsService.trackEvent(
        EventCategories.report,
        ReportEventActions.requestUserForAdditionnalInfos,
        this.testingSentence()
      );
    }
  }

  ngOnDestroy() {
    this.reportStorageService.removeReportInProgress();
  }

  newReport() {
    this.reportStorageService.removeReportInProgress();
    this.reportRouterService.routeToFirstStep();
  }

  testingSentence() {
    switch (this.abTestsService.getVersion(SVETestingScope)) {
      case SVETestingVersions.Test3_Sentence1:
        return 'Vous voulez en connaitre d\'avantage sur vos droits et savoir quelles suites pourraient éventuellement apporter les enquêteurs de la répression des fraudes à votre signalement ?';
      case SVETestingVersions.Test3_Sentence2:
        return 'Vous voulez en connaitre d\'avantage sur vos droits ?';
      case SVETestingVersions.Test3_Sentence3:
        return 'Vous voulez savoir quelles suites pourraient éventuellement apporter les enquêteurs de la répression des fraudes à votre signalement ?';
      case SVETestingVersions.Test3_Sentence4:
        return 'Vous souhaitez obtenir une réponse personnalisée à votre signalement, en plus des réponses de SignalConso ?';
      case SVETestingVersions.Test3_Sentence5:
        return 'Vous souhaitez que la DGCCRF analyse votre signalement en particulier ?';
      default:
        return undefined;
    }
  }

  requestAdditionnalInfos() {
    this.analyticsService.trackEvent(
      EventCategories.report,
      ReportEventActions.additionnalInfos,
      this.testingSentence()
    );
    this.infosRequested = true;
  }

}

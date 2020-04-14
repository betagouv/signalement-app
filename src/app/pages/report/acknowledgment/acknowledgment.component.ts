import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportStorageService } from '../../../services/report-storage.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.scss']
})
export class AcknowledgmentComponent implements OnInit, OnDestroy {

  step: Step;
  draftReport: DraftReport;

  constructor(private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService) { }

  ngOnInit() {
    this.step = Step.Acknowledgment;
    this.reportStorageService.retrieveReportInProgressFromStorage()
      .pipe(take(1))
      .subscribe(draftReport => {
        if (draftReport) {
          this.draftReport = draftReport;
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  ngOnDestroy() {
    this.reportStorageService.removeReportInProgress();
  }

  newReport() {
    this.reportStorageService.removeReportInProgress();
    this.reportRouterService.routeToFirstStep();
  }

  getReportLastSubcategory() {
    if (this.draftReport && this.draftReport.subcategories && this.draftReport.subcategories.length) {
      return this.draftReport.subcategories[this.draftReport.subcategories.length - 1];
    }
  }

}

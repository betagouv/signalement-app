import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Report, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.scss']
})
export class AcknowledgmentComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  step: Step;
  report: Report;

  constructor(private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService) { }

  ngOnInit() {
    this.step = Step.Acknowledgment;
    this.reportStorageService.retrieveReportInProgressFromStorage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(report => {
        if (report) {
          this.report = report;
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });

      setTimeout(() => {
        const title: HTMLElement = document.querySelector("#title-thanks");

        if (title) {
          title.focus();
          title.blur();
        }

      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  newReport() {
    this.reportStorageService.removeReportInProgress();
    this.reportRouterService.routeToFirstStep();
  }

}

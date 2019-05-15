import { Component, OnInit } from '@angular/core';
import { Report } from '../../../model/Report';
import { ReportRouterService, Step } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';

@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.scss']
})
export class AcknowledgmentComponent implements OnInit {

  step: Step;
  report: Report;

  constructor(private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService) { }

  ngOnInit() {
    this.step = Step.Acknowledgment;
    this.reportStorageService.reportInProgess.subscribe(report => {
      if (report) {
        this.report = report;
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  newReport() {
    this.reportStorageService.removeReportInProgress();
    this.reportRouterService.routeToFirstStep();
  }

}

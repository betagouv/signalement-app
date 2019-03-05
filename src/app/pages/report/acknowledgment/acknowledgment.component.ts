import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Report } from '../../../model/Report';
import { ReportRouterService, Step } from '../../../services/report-router.service';

@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.scss']
})
export class AcknowledgmentComponent implements OnInit {

  step: Step;
  report: Report;

  constructor(private reportService: ReportService,
              private reportRouterService: ReportRouterService) { }

  ngOnInit() {
    this.step = Step.Acknowledgment;
    this.reportService.currentReport.subscribe(report => {
      if (report) {
        this.report = report;
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  newReport() {
    this.reportService.changeReportFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }

}

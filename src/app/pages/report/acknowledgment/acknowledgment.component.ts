import { Component, OnInit } from '@angular/core';
import { ReportService, Step } from '../../../services/report.service';
import { Report } from '../../../model/Report';

@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.scss']
})
export class AcknowledgmentComponent implements OnInit {

  step: Step;
  report: Report;

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.step = Step.Acknowledgment;
    this.reportService.currentReport.subscribe(report => {
      if (report) {
        this.report = report;
      } else {
        this.reportService.reinit();
      }
    });
  }

  newReport() {
    this.reportService.changeReport(this.report, this.step);
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../../../model/Report';
import { Location } from '@angular/common';
import { Step } from '../../../services/report.service';
import { AnomalyService } from '../../../services/anomaly.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() report: Report;
  @Input() step: Step;

  constructor(private location: Location,
              private anomalyService: AnomalyService) { }

  ngOnInit() {
  }

  getStepClass(step: string) {
    return (this.step.toString() === step) ? 'current' : '';
  }

  back() {
    this.location.back();
  }

  getAnomalyBreadcrumbTitle() {
    const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
    if (anomaly) {
      return anomaly.breadcrumbTitle;
    }
  }
}

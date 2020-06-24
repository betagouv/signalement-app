import { Component, Input, OnInit } from '@angular/core';
import { DraftReport, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { Anomaly } from '../../../model/Anomaly';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() draftReport: DraftReport;
  @Input() step: Step;

  steps = Step;

  anomaly: Anomaly;

  constructor(private reportRouterService: ReportRouterService,
              private anomalyService: AnomalyService) { }

  ngOnInit() {
    if (this.draftReport) {
      this.anomaly = this.anomalyService.getAnomalyByCategory(this.draftReport.category);
    }
  }

  getStepClass(step: string) {
    return (this.step === Step[step]) ? 'current' : this.isStepAchieved(Step[step]) ? 'achieved' : 'todo';
  }

  isStepAchieved(step: Step) {
    return this.getStepNumber(this.step) > this.getStepNumber(step);
  }

  displayedStep(step: string) {
    if (this.isStepAchieved(Step[step])) {
      return '&#10003';
    } else {
      return this.getStepNumber(Step[step]);
    }
  }

  goToStep(step: string) {
    if (this.isStepAchieved(Step[step])) {
      this.reportRouterService.routeToStep(Step[step]);
    }
  }

  getStepNumber(step: Step) {
    const initialStep = this.anomaly && this.anomaly.subcategories && this.anomaly.subcategories.length ? 0 : -1;
    switch (step) {
      case Step.Problem: {
        return initialStep + 1;
      }
      case Step.Details: {
        return initialStep + 2;
      }
      case Step.Company: {
        return initialStep + 3;
      }
      case Step.Consumer: {
        return initialStep + 4;
      }
      case Step.Confirmation: {
        return initialStep + 5;
      }
    }
  }

  back() {
    this.reportRouterService.routeBackward(this.step);
  }

  precedeCategory() {
    const apostropheRequiredLetters = ['a', 'e', 'i', 'o', 'u', 'y', 'h'];
    if (apostropheRequiredLetters.indexOf(this.draftReport.category[0]) !== -1) {
      return 'd\'';
    } else {
      return 'de ';
    }
  }
}

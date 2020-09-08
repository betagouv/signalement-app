import { Component, Input, OnInit } from '@angular/core';
import { DraftReport, Step } from '../../../model/Report';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() draftReport: DraftReport;
  @Input() step: Step;

  steps = Step;

  constructor(private reportRouterService: ReportRouterService,
              private anomalyService: AnomalyService,
              private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(`Etape ${this.getStepNumber(this.step)} : ${pages.report[this.step.toLowerCase()].title}`);
    this.meta.updateTag({ name: 'description', content: pages.report[this.step.toLowerCase()].title });
  }

  getAnomaly() {
    if (this.draftReport) {
      return this.anomalyService.getAnomalyByCategory(this.draftReport.category);
    }
  }

  getStepClass(step: string) {
    return (this.step === Step[step]) ? 'current' : this.isStepAchieved(step) ? 'achieved' : 'todo';
  }

  isStepAchieved(step: string) {
    return this.getStepNumber(Step[this.step]) > this.getStepNumber(Step[step]);
  }

  displayedStep(step: string) {
    if (this.isStepAchieved(step)) {
      return '&#10003';
    } else {
      return this.getStepNumber(Step[step]);
    }
  }

  goToStep(step: string) {
    if (this.isStepAchieved(step)) {
      this.reportRouterService.routeToStep(Step[step]);
    }
  }

  getStepNumber(step: Step) {
    const anomaly = this.getAnomaly();
    const initialStep = anomaly && anomaly.subcategories && anomaly.subcategories.length ? 0 : -1;
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

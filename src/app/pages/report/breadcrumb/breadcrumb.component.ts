import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../../../model/Report';
import { Location } from '@angular/common';
import { Step } from '../../../services/report.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() report: Report;
  @Input() step: Step;

  constructor(private location: Location) { }

  ngOnInit() {
  }

  getStepClass(step: string) {
    return (this.step === Step[step]) ? 'current' : this.isStepAchieved(Step[step]) ? 'achieved' : '';
  }

  isStepAchieved(step: Step) {
    return this.getStepNumber(this.step) > this.getStepNumber(step);
  }

  displayedStep(step: string) {
    if (this.isStepAchieved(Step[step])) {
      return '&#10004';
    } else {
      return this.getStepNumber(Step[step]);
    }
  }

  getStepNumber(step: Step) {
    switch (step) {
      case Step.Subcategory: {
        return 1;
      }
      case Step.Details: {
        return 2;
      }
      case Step.Company: {
        return 3;
      }
      case Step.Consumer: {
        return 4;
      }
      case Step.Confirmation: {
        return 5;
      }
    }
  }

  back() {
    this.location.back();
  }
}

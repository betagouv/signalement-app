import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ReportService } from './report.service';
import { Router } from '@angular/router';
import { AnomalyService } from './anomaly.service';
import { Report, Step } from '../model/Report';

export enum ReportPaths {
  Category = '',
  Problem = 'signalement/le-probleme',
  Details = 'signalement/la-description',
  Company = 'signalement/le-commerçant',
  Consumer = 'signalement/le-consommateur',
  Confirmation = 'signalement/confirmation',
  Acknowledgment = 'signalement/accuse-de-reception',
  Information = 'signalement/information'
}

@Injectable({
  providedIn: 'root'
})
export class ReportRouterService {

  report: Report;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private anomalyService: AnomalyService,
              private reportService: ReportService,
              private router: Router) {

    this.reportService.currentReport.subscribe(report => this.report = report);

  }

  routeForward(currentStep: Step) {
    this.router.navigate(
      this.getRouteFromStep(this.nextStep(currentStep))
    );
  }

  routeBackward(currentStep: Step) {
    this.router.navigate(
      this.getRouteFromStep(this.previousStep(currentStep))
    );
  }

  routeToFirstStep() {
    this.router.navigate(
      this.getRouteFromStep(Step.Category)
    );
  }

  routeToStep(step: Step) {
   this.router.navigate(this.getRouteFromStep(step));
  }

  private getRouteFromStep(step: Step) {
    return [ReportPaths[step]];
  }

  nextStep(currentStep: Step) {
    switch (currentStep) {
      case Step.Category:
        const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
        if (anomaly.information) {
          return Step.Information;
        } else if (anomaly.subcategories && anomaly.subcategories.length) {
          return Step.Problem;
        } else {
          return Step.Details;
        }
      case Step.Problem:
        if (this.isReportLastSubcategoryInformation()) {
          return Step.Information;
        } else {
          return Step.Details;
        }
      case Step.Details:
        return Step.Company;
      case Step.Company:
        return Step.Consumer;
      case Step.Consumer:
        return Step.Confirmation;
      case Step.Confirmation:
        return Step.Acknowledgment;
      default:
        return Step.Category;
    }
  }

  previousStep(currentStep: Step) {
    switch (currentStep) {
      case Step.Problem:
        return Step.Category;
      case Step.Details:
        if (this.report.subcategories) {
          return Step.Problem;
        } else {
          return Step.Category;
        }
      case Step.Information:
        if (this.report && this.report.subcategories) {
          return Step.Problem;
        } else {
          return Step.Category;
        }
      case Step.Company:
        return Step.Details;
      case Step.Consumer:
        return Step.Company;
      case Step.Confirmation:
        return Step.Consumer;
      default:
        return Step.Category;
    }
  }

  isReportLastSubcategoryInformation() {
    return this.report
      && this.report.subcategories && this.report.subcategories.length
      && this.report.subcategories[this.report.subcategories.length - 1].information;
  }
}

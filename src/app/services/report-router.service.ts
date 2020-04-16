import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AnomalyService } from './anomaly.service';
import { DraftReport, Step } from '../model/Report';
import { ReportStorageService } from './report-storage.service';

export enum ReportPaths {
  Category = '',
  Problem = 'le-probleme',
  Details = 'la-description',
  Company = 'le-commerçant',
  Consumer = 'le-consommateur',
  Confirmation = 'confirmation',
  Acknowledgment = 'accuse-de-reception',
  Information = 'information'
}

@Injectable({
  providedIn: 'root'
})
export class ReportRouterService {

  draftReport: DraftReport;

  constructor(private anomalyService: AnomalyService,
              private reportStorageService: ReportStorageService,
              private router: Router) {

    this.reportStorageService.retrieveReportInProgressFromStorage().subscribe(draftReport => {
      this.draftReport = draftReport;
    });

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
    const route = [];
    if (step !== Step.Category && this.anomalyService.getAnomalyByCategory(this.draftReport.category)) {
      route.push(this.anomalyService.getAnomalyByCategory(this.draftReport.category).path);
    }
    route.push(ReportPaths[step]);
    return route;
  }

  nextStep(currentStep: Step) {
    switch (currentStep) {
      case Step.Category:
        const anomaly = this.anomalyService.getAnomalyByCategory(this.draftReport.category);
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
        if (this.draftReport.subcategories) {
          return Step.Problem;
        } else {
          return Step.Category;
        }
      case Step.Information:
        if (this.draftReport && this.draftReport.subcategories) {
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
    return this.draftReport
      && this.draftReport.subcategories && this.draftReport.subcategories.length
      && this.draftReport.subcategories[this.draftReport.subcategories.length - 1].information;
  }
}

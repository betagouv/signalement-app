import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AnomalyService } from './anomaly.service';
import { DraftReport, Step } from '../model/Report';
import { ReportStorageService } from './report-storage.service';
import { instanceOfSubcategoryInformation } from '../model/Anomaly';

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

  constructor(private anomalyService: AnomalyService,
              private reportStorageService: ReportStorageService,
              private router: Router) {
  }

  routeForward(currentStep: Step) {
    this.reportStorageService.retrieveReportInProgress().subscribe(
      draftReport => {
        this.router.navigate(this.getRouteFromStep(this.nextStep(currentStep, draftReport), draftReport));
      }
    );
  }

  routeBackward(currentStep: Step) {
    this.reportStorageService.retrieveReportInProgress().subscribe(
      draftReport => {
        this.router.navigate(this.getRouteFromStep(this.previousStep(currentStep, draftReport), draftReport));
      }
    );
  }

  routeToFirstStep() {
    this.reportStorageService.retrieveReportInProgress().subscribe(
      draftReport => {
        this.router.navigate(this.getRouteFromStep(Step.Category, draftReport));
      }
    );
  }

  routeToStep(step: Step) {
    this.reportStorageService.retrieveReportInProgress().subscribe(
      draftReport => {
        this.router.navigate(this.getRouteFromStep(step, draftReport));
      }
    );
  }

  private getRouteFromStep(step: Step, draftReport: DraftReport) {
    const route = [];
    if (step !== Step.Category && this.anomalyService.getAnomalyByCategory(draftReport.category)) {
      route.push(this.anomalyService.getAnomalyByCategory(draftReport.category).path);
    }
    route.push(ReportPaths[step]);
    return route;
  }

  private nextStep(currentStep: Step, draftReport: DraftReport) {
    switch (currentStep) {
      case Step.Category:
        const anomaly = this.anomalyService.getAnomalyByCategory(draftReport.category);
        if (anomaly.information) {
          return Step.Information;
        } else if (anomaly.subcategories && anomaly.subcategories.length) {
          return Step.Problem;
        } else {
          return Step.Details;
        }
      case Step.Problem:
        if (instanceOfSubcategoryInformation(draftReport.lastSubcategory)) {
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

  private previousStep(currentStep: Step, draftReport: DraftReport) {
    switch (currentStep) {
      case Step.Problem:
        return Step.Category;
      case Step.Details:
        if (draftReport.subcategories) {
          return Step.Problem;
        } else {
          return Step.Category;
        }
      case Step.Information:
        if (draftReport && draftReport.subcategories) {
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
}

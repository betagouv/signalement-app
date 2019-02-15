import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReportService } from './report.service';
import { Router } from '@angular/router';
import { AnomalyService } from './anomaly.service';
import { Report } from '../model/Report';

export enum Step {
  Category = 'Category',
  Subcategory = 'Subcategory',
  Details = 'Details',
  Company = 'Company',
  Consumer = 'Consumer',
  Confirmation = 'Confirmation',
  Acknowledgment = 'Acknowledgment',
  Information = 'Information'
}

export enum ReportPaths {
  Category = '',
  Subcategory = 'signalement/le-probleme',
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
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
    this.router.navigate(
      this.getRouteFromStep(this.nextStep(currentStep))
    );
  }

  routeBackward(currentStep: Step) {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
    this.router.navigate(
      this.getRouteFromStep(this.previousStep(currentStep))
    );
  }

  routeToFirstStep() {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
    this.router.navigate(
      this.getRouteFromStep(Step.Category)
    );
  }

  getRouteFromStep(step: Step) {
    return [ReportPaths[step]];
  }

  nextStep(currentStep: Step) {
    switch (currentStep) {
      case Step.Category:
        const anomaly = this.anomalyService.getAnomalyByCategory(this.report.category);
        if (anomaly.information) {
          return Step.Information;
        } else if (anomaly.subcategories && anomaly.subcategories.length) {
          return Step.Subcategory;
        } else {
          return Step.Details;
        }
      case Step.Subcategory:
        if (this.report.subcategory.information) {
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
      case Step.Subcategory:
        return Step.Category;
      case Step.Details:
        if (this.report.subcategory) {
          return Step.Subcategory;
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

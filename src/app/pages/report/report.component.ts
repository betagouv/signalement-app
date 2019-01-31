import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Anomaly, Information, Subcategory } from '../../model/Anomaly';
import { AnomalyService } from '../../services/anomaly.service';
import { Report, ReportDetails } from '../../model/Report';
import { Company } from '../../model/Company';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../services/analytics.service';
import { isPlatformBrowser } from '@angular/common';
import { Consumer } from '../../model/Consumer';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  step: Step;
  report: Report;

  anomalies: Anomaly[];

  informationToDisplay: Information;
  showSuccess: boolean;
  showSecondaryCategories: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              public formBuilder: FormBuilder,
              private anomalyService: AnomalyService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAnomalies();
    }

    this.informationToDisplay = null;
    this.showSecondaryCategories = false;
    this.step = Step.Category;
  }

  loadAnomalies() {
    this.anomalyService.getAnomalies().subscribe(anomalyList => {
      this.anomalies = anomalyList;
    });
  }

  primaryCategoriesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies
        .filter(a => a.rank < 100)
        .sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  secondaryCategoriesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies
        .filter(a => a.rank >= 100)
        .sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  displaySecondaryCategories() {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.secondaryCategories);
    this.showSecondaryCategories = true;
  }

  selectAnomaly(anomaly: Anomaly) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
    this.report = new Report();
    this.report.category = anomaly.category;
    if (anomaly.information) {
      this.displayInformation(anomaly.information);
    } else {
      this.stepForward();
    }
  }

  displayInformation(information: Information) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.information, information.title);
    this.informationToDisplay = information;
    this.step = Step.Information;
    this.stepForward();
  }

  getSubcategories() {
    return this.anomalies
      .find(anomaly => anomaly.category === this.report.category)
      .subcategories;
  }

  onSubcategoryValidate(subcategory: Subcategory) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateSubcategory, subcategory.title);
    this.report.subcategory = subcategory;
    if (subcategory.information) {
      this.displayInformation(subcategory.information);
    } else {
      this.stepForward();
    }
  }

  onDetailsValidate(details: ReportDetails) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateDetails);
    this.report.details = details;
    console.log('this.report.details', this.report.details)
    this.stepForward();
  }

  onCompanyValidate(company: Company) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCompany);
    this.report.company = company;
    this.stepForward();
  }

  onConsumerValidate(consumer: Consumer) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateConsumer);
    this.report.consumer = consumer;
    this.stepForward();
  }

  onConfimationValidate() {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateConfirmation);
    this.stepForward();
  }

  isStep(step: string) {
    return this.step.toString() === step;
  }

  stepForward() {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
    switch (this.step) {
      case Step.Category:
        if (this.getSubcategories() && this.getSubcategories().length) {
          this.step = Step.Subcategory;
        } else {
          this.step = Step.Details;
        }
        break;
      case Step.Subcategory:
        this.step = Step.Details;
        break;
      case Step.Details:
        this.step = Step.Company;
        break;
      case Step.Company:
        this.step = Step.Consumer;
        break;
      case Step.Consumer:
        this.step = Step.Confirmation;
        break;
      case Step.Confirmation:
        this.step = Step.Acknowledgment;
        break;
      default:
        break;
    }
  }

  stepBackward() {
    switch (this.step) {
      case Step.Subcategory:
        this.report.subcategory = null;
        this.step = Step.Category;
        break;
      case Step.Information:
        this.report.subcategory = null;
        this.step = Step.Category;
        break;
      case Step.Details:
        this.report.details = null;
        if (this.getSubcategories() && this.getSubcategories().length) {
          this.step = Step.Subcategory;
        } else {
          this.step = Step.Category;
        }
        break;
      case Step.Company:
        this.report.company = null;
        this.step = Step.Details;
        break;
      case Step.Consumer:
        this.report.consumer = null;
        this.step = Step.Company;
        break;
      case Step.Confirmation:
        this.step = Step.Consumer;
        break;
      default:
        this.report.category = '';
        break;
    }
  }
}

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

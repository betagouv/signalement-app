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
    this.step = Step.Category;
  }

  loadAnomalies() {
    this.anomalyService.getAnomalies().subscribe(anomalyList => {
      this.anomalies = anomalyList;
    });
  }

  anomaliesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies.sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  selectAnomaly(anomaly: Anomaly) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
    if (anomaly.information) {
      this.displayInformation(anomaly.information);
    } else {
      this.report = new Report();
      this.report.category = anomaly.category;
      this.stepForward();
    }
  }

  displayInformation(information: Information) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.information, information.title);
    this.informationToDisplay = information;
    this.step = Step.Information;
  }

  getSubcategories(category: string) {
    return this.anomalies
      .find(anomaly => anomaly.category === category)
      .subcategories;
  }

  onSubcategoryValidate(subcategory: Subcategory) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateSubcategory, subcategory.title);
    if (subcategory.information) {
      this.displayInformation(subcategory.information);
    } else {
      this.report.subcategory = subcategory;
      this.stepForward();
    }
  }

  onDetailsValidate(details: ReportDetails) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateDetails);
    this.report.details = details;
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
    switch (this.step) {
      case Step.Category:
        this.step = Step.Subcategory;
        break;
      case Step.Subcategory:
        this.step = Step.Description;
        break;
      case Step.Description:
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
      case Step.Description:
        this.report.details = null;
        this.step = Step.Subcategory;
        break;
      case Step.Company:
        this.report.company = null;
        this.step = Step.Description;
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
  Description = 'Description',
  Company = 'Company',
  Consumer = 'Consumer',
  Confirmation = 'Confirmation',
  Acknowledgment = 'Acknowledgment',
  Information = 'Information'
}

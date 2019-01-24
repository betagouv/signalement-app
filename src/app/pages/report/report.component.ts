import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Anomaly, Precision } from '../../model/Anomaly';
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

  anomalySelected: Anomaly;
  anomalies: Anomaly[];

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

    this.anomalySelected = null;
    this.step = Step.Category;
  }

  loadAnomalies() {
    this.anomalyService.getAnomalies().subscribe(anomalyList => {
      this.anomalies = anomalyList;
    });
  }

  private resetAnomalyCategory() {
    this.report.anomalyCategory = '';
  }

  selectAnomaly(anomaly: Anomaly) {
    this.analyticsService.trackEvent(
      EventCategories.report, ReportEventActions.selectAnomalyCategory, anomaly.category
    );
    this.anomalySelected = anomaly;
    if (this.anomalySelected.information) {
      this.step = Step.Information;
    } else {
      this.report = new Report();
      this.report.anomalyCategory = anomaly.category;
      this.stepForward();
    }
  }

  isIntoxicationAlimentaire() {
    return this.report.anomalyCategory === IntoxicationAlimentaire;
  }

  onCompanyValidate(company: Company) {
    this.report.company = company;
    this.stepForward();
  }

  onPrecisionValidate(precision: Precision) {
    this.analyticsService.trackEvent(
      EventCategories.report, ReportEventActions.selectAnomalyPrecision, precision.title
    );
    this.report.anomalyPrecision = precision.title;
    this.stepForward();
  }

  onDetailsValidate(details: ReportDetails) {
    this.report.details = details;
    this.stepForward();
  }

  onConsumerValidate(consumer: Consumer) {
    this.report.consumer = consumer;
    this.stepForward();
  }

  onConfimationValidate() {
    this.stepForward();
  }

  anomaliesOrderByRank() {
    if (this.anomalies) {
      return this.anomalies.sort((a1, a2) => a1.rank > a2.rank ? 1 : a1.rank === a2.rank ? 0 : -1);
    }
  }

  isStep(step: string) {
    return this.step.toString() === step;
  }

  stepForward() {
    switch (this.step) {
      case Step.Category:
        this.step = Step.Precision;
        break;
      case Step.Precision:
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
      case Step.Precision:
        this.report.anomalyPrecision = '';
        this.step = Step.Category;
        break;
      case Step.Description:
        this.report.details = null;
        this.step = Step.Precision;
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
        this.report.anomalyCategory = '';
        break;
    }
  }
}

export const IntoxicationAlimentaire = 'Intoxication alimentaire';

export enum Step {
  Category = 'Category',
  Precision = 'Precision',
  Description = 'Description',
  Company = 'Company',
  Consumer = 'Consumer',
  Confirmation = 'Confirmation',
  Acknowledgment = 'Acknowledgment',
  Information = 'Information'
}

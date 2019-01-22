import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Anomaly, Precision } from '../../model/Anomaly';
import { AnomalyService } from '../../services/anomaly.service';
import { ReportService } from '../../services/report.service';
import { Report, ReportDetails } from '../../model/Report';
import { BsLocaleService } from 'ngx-bootstrap';
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

  precisionForm: FormGroup;
  anomalyPrecisionCtrl: FormControl;

  reportForm: FormGroup;
  contactAgreementCtrl: FormControl;

  anomalies: Anomaly[];
  anomalyPrecisionList: Precision[];

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              public formBuilder: FormBuilder,
              private anomalyService: AnomalyService,
              private reportService: ReportService,
              private localeService: BsLocaleService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.localeService.use('fr');

    this.initReportForm(true);
    if (isPlatformBrowser(this.platformId)) {
      this.loadAnomalies();
    }

    this.step = Step.Category;
  }

  initReportForm(fullInit: boolean) {
    this.showErrors = false;
    this.showSuccess = false;

    this.anomalyPrecisionCtrl = this.formBuilder.control('', Validators.required);

    if (fullInit) {
      this.contactAgreementCtrl = this.formBuilder.control(false);
    }

    this.precisionForm = this.formBuilder.group({
      anomalyPrecision: this.anomalyPrecisionCtrl
    });

    this.reportForm = this.formBuilder.group({
      contactAgreement: this.contactAgreementCtrl
    });

  }

  addNewReport() {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.addAnotherReport);
    this.initReportForm(false);
  }

  loadAnomalies() {
    this.anomalyService.getAnomalies().subscribe(anomalyList => {
      this.anomalies = anomalyList;
    });
  }

  private resetAnomalyCategory() {
    this.report.anomalyCategory = '';
    this.resetAnomalyPrecision();
  }

  selectAnomalyCategory(category) {
    this.analyticsService.trackEvent(
      EventCategories.report, ReportEventActions.selectAnomalyCategory, category
    );
    this.report = new Report();
    this.report.anomalyCategory = category;
    this.stepForward();
    this.resetAnomalyPrecision();
    this.anomalyPrecisionList = this.getAnomalyPrecisionList();
  }

  private resetAnomalyPrecision() {
    this.anomalyPrecisionList = [];
    this.anomalyPrecisionCtrl.setValue('');
  }

  private getAnomalyPrecisionList() {
    return this.anomalies
      .find(anomaly => anomaly.category === this.report.anomalyCategory)
      .precisionList;
  }

  selectAnomalyPrecision() {
    this.analyticsService.trackEvent(
      EventCategories.report, ReportEventActions.selectAnomalyPrecision, this.anomalyPrecisionCtrl.value
    );
    this.report.anomalyPrecision = this.anomalyPrecisionCtrl.value;
    this.stepForward();
  }

  createReport() {
    if (!this.reportForm.valid) {
      this.trackFormErrors();
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.formSubmitted);
      this.loading = true;
      this.reportService.createReport(
        Object.assign(
          this.report,
          {
            anomalyPrecision: this.anomalyPrecisionCtrl.value,
            contactAgreement: this.contactAgreementCtrl.value
          }
        )
      ).subscribe(
        result => {
          this.loading = false;
          return this.treatCreationSuccess();
        },
        error => {
          this.loading = false;
          // TODO cas d'erreur
        });

    }
  }

  private trackFormErrors() {
    const errors = [];
    Object.keys(this.reportForm.controls).forEach(key => {
      const reportErrors: ValidationErrors = this.reportForm.get(key).errors;
      if (reportErrors != null) {
        Object.keys(reportErrors).forEach(keyError => {
          errors.push(`${key} - ${keyError}`);
        });
      }
    });
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.invalidForm, errors);
  }

  private treatCreationSuccess() {
    this.showSuccess = true;
  }

  isIntoxicationAlimentaire() {
    return this.report.anomalyCategory === IntoxicationAlimentaire;
  }

  onCompanySelect(company: Company) {
    this.report.companyName = company.name;
    this.report.companyPostalCode = company.postalCode;
    this.report.companyAddress = this.getCompanyAddress(company);
    if (company.siret) {
      this.report.companySiret = company.siret;
    }
    this.stepForward();
  }

  onDetailsSubmit(details: ReportDetails) {
    this.report.details = details;
    this.stepForward();
  }

  onConsumerSubmit(consumer: Consumer) {
    this.report.consumer = consumer;
    this.stepForward();
  }

  getCompanyAddress(company: Company) {
    let address = '';
    const addressAttibutes = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7'];
    if (company) {
      for (const attribute of addressAttibutes) {
        if (company[attribute]) {
          address = address.concat(`${company[attribute]} - `);
        }
      }
    }
    return address.substring(0, address.length - 3);
  }

  newReport() {
    this.ngOnInit();
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
      default:
        break;
    }
  }

  stepBackward() {
    switch (this.step) {
      case Step.Precision:
        this.report.anomalyCategory = '';
        this.step = Step.Category;
        break;
      case Step.Description:
        this.report.anomalyPrecision = '';
        this.step = Step.Precision;
        break;
      case Step.Company:
        this.report.details = null;
        this.step = Step.Description;
        break;
      case Step.Consumer:
        this.step = Step.Company;
        break;
      case Step.Confirmation:
        this.report.consumer = null;
        this.step = Step.Consumer;
        break;
      default:
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
  Confirmation = 'Confirmation'
}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Anomaly, Precision } from '../../model/Anomaly';
import { AnomalyService } from '../../services/anomaly.service';
import { ReportingService } from '../../services/reporting.service';
import { Reporting } from '../../model/Reporting';
import { BsLocaleService } from 'ngx-bootstrap';
import { Company } from '../../model/Company';
import { AnalyticsService, EventCategories, ReportingEventActions } from '../../services/analytics.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {

  step: Step;
  reporting: Reporting;

  precisionForm: FormGroup;
  anomalyPrecisionCtrl: FormControl;

  reportingForm: FormGroup;
  anomalyDateCtrl: FormControl;
  anomalyTimeSlotCtrl: FormControl;
  descriptionCtrl: FormControl;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;
  contactAgreementCtrl: FormControl;

  ticketFile: File;
  anomalyFile: File;

  anomalies: Anomaly[];
  anomalyPrecisionList: Precision[];
  plageHoraireList: number[];

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              public formBuilder: FormBuilder,
              private anomalyService: AnomalyService,
              private reportingService: ReportingService,
              private localeService: BsLocaleService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.localeService.use('fr');

    this.initReportingForm(true);
    this.constructPlageHoraireList();
    if (isPlatformBrowser(this.platformId)) {
      this.loadAnomalies();
    }

    this.step = Step.Category;
  }

  initReportingForm(fullInit: boolean) {
    this.showErrors = false;
    this.showSuccess = false;

    this.anomalyPrecisionCtrl = this.formBuilder.control('', Validators.required);
    this.descriptionCtrl = this.formBuilder.control('');

    if (fullInit) {
      this.anomalyDateCtrl = this.formBuilder.control('', Validators.required);
      this.anomalyTimeSlotCtrl = this.formBuilder.control('');
      this.firstNameCtrl = this.formBuilder.control('', Validators.required);
      this.lastNameCtrl = this.formBuilder.control('', Validators.required);
      this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
      this.contactAgreementCtrl = this.formBuilder.control(false);
    }

    this.precisionForm = this.formBuilder.group({
      anomalyPrecision: this.anomalyPrecisionCtrl
    });

    this.reportingForm = this.formBuilder.group({
      anomalyDate: this.anomalyDateCtrl,
      anomalyTimeSlot: this.anomalyTimeSlotCtrl,
      description: this.descriptionCtrl,
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl,
      contactAgreement: this.contactAgreementCtrl
    });

  }

  addNewReporting() {
    this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.addAnotherReporting);
    this.initReportingForm(false);
  }

  constructPlageHoraireList() {
    this.plageHoraireList = [];
    for (let i = 0; i < 24; i++) {
      this.plageHoraireList.push(i);
    }
  }

  loadAnomalies() {
    this.anomalyService.getAnomalies().subscribe(anomalyList => {
      this.anomalies = anomalyList;
    });
  }

  private resetAnomalyCategory() {
    this.reporting.anomalyCategory = '';
    this.resetAnomalyPrecision();
  }

  selectAnomalyCategory(category) {
    this.analyticsService.trackEvent(
      EventCategories.reporting, ReportingEventActions.selectAnomalyCategory, category
    );
    this.reporting = new Reporting();
    this.reporting.anomalyCategory = category;
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
      .find(anomaly => anomaly.category === this.reporting.anomalyCategory)
      .precisionList;
  }

  selectAnomalyPrecision() {
    this.analyticsService.trackEvent(
      EventCategories.reporting, ReportingEventActions.selectAnomalyPrecision, this.anomalyPrecisionCtrl.value
    );
    this.reporting.anomalyPrecision = this.anomalyPrecisionCtrl.value;
    this.stepForward();
  }

  createReporting() {
    if (!this.reportingForm.valid) {
      this.trackFormErrors();
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.formSubmitted);
      this.loading = true;
      this.reportingService.createReporting(
        Object.assign(
          this.reporting,
          {
            anomalyPrecision: this.anomalyPrecisionCtrl.value,
            anomalyDate: this.anomalyDateCtrl.value,
            anomalyTimeSlot: this.anomalyTimeSlotCtrl.value,
            description: this.descriptionCtrl.value,
            firstName: this.firstNameCtrl.value,
            lastName: this.lastNameCtrl.value,
            email: this.emailCtrl.value,
            contactAgreement: this.contactAgreementCtrl.value,
            ticketFile: this.ticketFile,
            anomalyFile: this.anomalyFile
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
    Object.keys(this.reportingForm.controls).forEach(key => {
      const reportingErrors: ValidationErrors = this.reportingForm.get(key).errors;
      if (reportingErrors != null) {
        Object.keys(reportingErrors).forEach(keyError => {
          errors.push(`${key} - ${keyError}`);
        });
      }
    });
    this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.invalidForm, errors);
  }

  private treatCreationSuccess() {
    this.showSuccess = true;
  }

  onTicketFileSelected(file: File) {
    this.ticketFile = file;
  }

  onAnomalyFileSelected(file: File) {
    this.anomalyFile = file;
  }

  isIntoxicationAlimentaire() {
    return this.reporting.anomalyCategory === IntoxicationAlimentaire;
  }

  onCompanySelected(company: Company) {
    this.reporting.companyName = company.name;
    this.reporting.companyPostalCode = company.postalCode;
    this.reporting.companyAddress = this.getCompanyAddress(company)
    if (company.siret) {
      this.reporting.companySiret = company.siret;
    }
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

  newReporting() {
    this.ngOnInit();
  }

  isStep(step: string) {
    return this.step.toString() === step;
  }

  stepBackward() {
    switch (this.step) {
      case Step.Precision:
        this.step = Step.Category
        break;
      case Step.Description:
        this.step = Step.Precision;
        break;
      case Step.Company:
        this.step = Step.Description
        break;
      case Step.Identity:
        this.step = Step.Company
        break;
      case Step.Confirmation:
        this.step = Step.Identity
        break;
      default:
        break;
    }
  }

  stepForward() {
    switch (this.step) {
      case Step.Category:
        this.step = Step.Precision
        break;
      case Step.Precision:
        this.step = Step.Description;
        break;
      case Step.Description:
        this.step = Step.Company
        break;
      case Step.Company:
        this.step = Step.Identity
        break;
      case Step.Identity:
        this.step = Step.Confirmation
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
  Identity = 'Identity',
  Confirmation = 'Confirmation'
}

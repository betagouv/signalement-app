import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Anomaly, AnomalyInfo, AnomalyType } from '../../model/Anomaly';
import { AnomalyService } from '../../services/anomaly.service';
import { ReportingService } from '../../services/reporting.service';
import { Reporting } from '../../model/Reporting';
import { BsLocaleService } from 'ngx-bootstrap';
import { Company } from '../../model/Company';
import { AnalyticsService, EventCategories, ReportingEventActions } from '../../services/analytics.service';

@Component({
  selector: 'app-reporting-form',
  templateUrl: './reporting-form.component.html',
  styleUrls: ['./reporting-form.component.scss']
})
export class ReportingFormComponent implements OnInit {

  reportingForm: FormGroup;
  companyTypeCtrl: FormControl;
  anomalyCategoryCtrl: FormControl;
  anomalyPrecisionCtrl: FormControl;
  anomalyDateCtrl: FormControl;
  anomalyTimeSlotCtrl: FormControl;
  descriptionCtrl: FormControl;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;
  contactAgreementCtrl: FormControl;
  companyCtrl: FormControl;

  ticketFile: File;
  anomalyFile: File;

  anomalies: Anomaly[];
  anomalyInfos: AnomalyInfo[];
  anomalyTypeList: AnomalyType[];
  anomalyPrecisionList: string[];
  plageHoraireList: number[];

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;
  anomalyInfo: AnomalyInfo;


  constructor(public formBuilder: FormBuilder,
              private anomalyService: AnomalyService,
              private reportingService: ReportingService,
              private localeService: BsLocaleService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.showErrors = false;
    this.localeService.use('fr');

    this.initReportingForm();
    this.constructPlageHoraireList();
    this.loadAnomalies();
    this.loadAnomalyInfos();
  }

  private initReportingForm() {
    this.companyTypeCtrl = this.formBuilder.control('', Validators.required);
    this.anomalyCategoryCtrl = this.formBuilder.control('', Validators.required);
    this.anomalyPrecisionCtrl = this.formBuilder.control('', Validators.required);
    this.anomalyDateCtrl = this.formBuilder.control('', Validators.required);
    this.anomalyTimeSlotCtrl = this.formBuilder.control('');
    this.descriptionCtrl = this.formBuilder.control('');
    this.firstNameCtrl = this.formBuilder.control('', Validators.required);
    this.lastNameCtrl = this.formBuilder.control('', Validators.required);
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.contactAgreementCtrl = this.formBuilder.control(false);
    this.companyCtrl = this.formBuilder.control('', Validators.required);

    this.reportingForm = this.formBuilder.group({
      companyType: this.companyTypeCtrl,
      anomalyDate: this.anomalyDateCtrl,
      anomalyTimeSlot: this.anomalyTimeSlotCtrl,
      description: this.descriptionCtrl,
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl,
      contactAgreement: this.contactAgreementCtrl,
      company: this.companyCtrl
    });
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

  loadAnomalyInfos() {
    this.anomalyService.getAnomalyInfos().subscribe(anomalyInfoList => {
      this.anomalyInfos = anomalyInfoList;
    });
  }

  changeCompanyType() {
    this.resetAnomalyCategory();
    this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.selectCompanyType, this.companyTypeCtrl.value);
    if (this.companyTypeCtrl.value !== '') {
      this.anomalyTypeList = this.getAnomalyTypeList();
      this.reportingForm.addControl('anomalyCategory', this.anomalyCategoryCtrl);
    }
  }

  private resetAnomalyCategory() {
    this.anomalyTypeList = [];
    this.reportingForm.removeControl('anomalyCategory');
    this.anomalyCategoryCtrl.setValue('');
    this.resetAnomalyPrecision();
  }

  private getAnomalyTypeList() {
    return this.anomalies
        .find(anomaly => anomaly.companyType === this.companyTypeCtrl.value)
        .anomalyTypeList;
  }

  changeAnomalyCategory() {
    this.resetAnomalyPrecision();
    this.analyticsService.trackEvent(
      EventCategories.reporting, ReportingEventActions.selectAnomalyCategory, this.anomalyCategoryCtrl.value
    );
    if (this.anomalyCategoryCtrl.value !== '') {
      this.anomalyPrecisionList = this.getAnomalyPrecisionList();
      if (this.anomalyPrecisionList.length) {
        this.reportingForm.addControl('anomalyPrecision', this.anomalyPrecisionCtrl);
      }
    }
  }

  private resetAnomalyPrecision() {
    this.anomalyPrecisionList = [];
    this.reportingForm.removeControl('anomalyPrecision');
    this.anomalyPrecisionCtrl.setValue('');
    this.anomalyInfo = null;
  }

  private getAnomalyPrecisionList() {
    return this.getAnomalyTypeList()
      .find(anomalyType => anomalyType.category === this.anomalyCategoryCtrl.value)
      .precisionList;
  }

  changeAnomalyPrecision() {
    this.analyticsService.trackEvent(
      EventCategories.reporting, ReportingEventActions.selectAnomalyPrecision, this.anomalyPrecisionCtrl.value
    );
    this.anomalyInfo = this.anomalyInfos.find(anomalyInfo => anomalyInfo.key === this.anomalyPrecisionCtrl.value);
    if (this.anomalyInfo) {
      this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.information, this.anomalyInfo.key);
    }
  }

  createReporting() {
    if (!this.reportingForm.valid) {
      this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.invalidForm);
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.formSubmitted);
      this.loading = true;
      this.reportingService.createReporting(
        Object.assign(
          new Reporting(),
          {
            companyType: this.companyTypeCtrl.value,
            anomalyCategory: this.anomalyCategoryCtrl.value,
            anomalyPrecision: this.anomalyPrecisionCtrl.value,
            anomalyDate: this.anomalyDateCtrl.value,
            anomalyTimeSlot: this.anomalyTimeSlotCtrl.value,
            description: this.descriptionCtrl.value,
            firstName: this.firstNameCtrl.value,
            lastName: this.lastNameCtrl.value,
            email: this.emailCtrl.value,
            contactAgreement: this.contactAgreementCtrl.value,
            ticketFile: this.ticketFile,
            anomalyFile: this.anomalyFile,
            companyName: this.companyCtrl.value.name,
            companyAddress: this.getCompanyAddress(),
            companyPostalCode: this.companyCtrl.value.postalCode,
            companySiret: this.companyCtrl.value.siret ? this.companyCtrl.value.siret : ''
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
    return this.anomalyCategoryCtrl.value === IntoxicationAlimentaire;
  }

  onCompanySelected(company: Company) {
    this.companyCtrl.setValue(company);
  }

  changeCompany() {
    this.companyCtrl.reset();
  }

  getCompanyAddress() {
    let address = '';
    const addressAttibutes = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7'];
    if (this.companyCtrl.value) {
      for (const attribute of addressAttibutes) {
        if (this.companyCtrl.value[attribute]) {
          address = address.concat(`${this.companyCtrl.value[attribute]} - `);
        }
      }
    }
    return address.substring(0, address.length - 3);
  }

  newReporting() {
    this.ngOnInit();
  }
}

export const IntoxicationAlimentaire = 'Intoxication alimentaire';

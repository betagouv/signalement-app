import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent implements OnInit {

  step: Step;
  draftReport: DraftReport;

  consumerForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;
  contactAgreementCtrl: FormControl;

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Consumer;
    this.reportStorageService.retrieveReportInProgressFromStorage()
      .pipe(take(1))
      .subscribe(report => {
        if (report) {
          this.draftReport = report;
          this.initConsumerForm();
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  initConsumerForm() {
    this.firstNameCtrl = this.formBuilder.control(this.draftReport.consumer ? this.draftReport.consumer.firstName : '', Validators.required);
    this.lastNameCtrl = this.formBuilder.control(this.draftReport.consumer ? this.draftReport.consumer.lastName : '', Validators.required);
    this.emailCtrl = this.formBuilder.control(
      this.draftReport.consumer ? this.draftReport.consumer.email : '', [Validators.required, Validators.email]
    );

    this.consumerForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl
    });

    if (this.draftReport.employeeConsumer) {
      this.contactAgreementCtrl = this.formBuilder.control(false);
    } else {
      this.contactAgreementCtrl = this.formBuilder.control(this.draftReport.contactAgreement, Validators.required);
      this.consumerForm.addControl('contactAgreement', this.contactAgreementCtrl);
    }
  }

  submitConsumerForm() {
    if (!this.consumerForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateConsumer);
      const consumer = new Consumer();
      consumer.firstName = this.firstNameCtrl.value;
      consumer.lastName = this.lastNameCtrl.value;
      consumer.email = this.emailCtrl.value;
      this.draftReport.consumer = consumer;
      this.draftReport.contactAgreement = this.contactAgreementCtrl.value;
      this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
      this.reportRouterService.routeForward(this.step);
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }
}

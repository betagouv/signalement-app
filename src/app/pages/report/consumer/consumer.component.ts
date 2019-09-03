import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Report, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  step: Step;
  report: Report;

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
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(report => {
        if (report) {
          this.report = report;
          this.initConsumerForm();
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initConsumerForm() {
    this.firstNameCtrl = this.formBuilder.control(this.report.consumer ? this.report.consumer.firstName : '', Validators.required);
    this.lastNameCtrl = this.formBuilder.control(this.report.consumer ? this.report.consumer.lastName : '', Validators.required);
    this.emailCtrl = this.formBuilder.control(
      this.report.consumer ? this.report.consumer.email : '', [Validators.required, Validators.email]
    );
    this.contactAgreementCtrl = this.formBuilder.control(this.report.contactAgreement, Validators.required);

    this.consumerForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl,
      contactAgreement: this.contactAgreementCtrl
    });
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
      this.report.consumer = consumer;
      this.report.contactAgreement = this.contactAgreementCtrl.value;
      this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
      this.reportRouterService.routeForward(this.step);
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }
}

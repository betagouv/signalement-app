import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';
import { ReportService, Step } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { Report } from '../../../model/Report';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent implements OnInit {

  step: Step;
  report: Report;

  consumerForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Consumer;
    this.reportService.currentReport.subscribe(report => {
      if (report) {
        this.report = report;
        this.initConsumerForm();
      } else {
        this.reportService.reinit();
      }
    });
  }

  initConsumerForm() {
    this.firstNameCtrl = this.formBuilder.control(this.report.consumer ? this.report.consumer.firstName : '', Validators.required);
    this.lastNameCtrl = this.formBuilder.control(this.report.consumer ? this.report.consumer.lastName : '', Validators.required);
    this.emailCtrl = this.formBuilder.control(
      this.report.consumer ? this.report.consumer.email : '', [Validators.required, Validators.email]
    );

    this.consumerForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl,
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
      this.reportService.changeReport(this.report, this.step);
    }
  }
}

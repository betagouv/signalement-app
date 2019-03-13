import { Component, OnInit } from '@angular/core';
import { Report } from '../../../model/Report';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { ReportRouterService, Step } from '../../../services/report-router.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  step: Step;
  report: Report;

  confirmationForm: FormGroup;
  contactAgreementCtrl: FormControl;

  showErrors: boolean;
  loading: boolean;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.step = Step.Confirmation;
    this.reportService.currentReport.subscribe(report => {
      if (report) {
        this.report = report;
        this.initConfirmationForm();
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  initConfirmationForm() {
    this.showErrors = false;

    this.contactAgreementCtrl = this.formBuilder.control('');

    this.confirmationForm = this.formBuilder.group({
      contactAgreement: this.contactAgreementCtrl
    });
  }

  submitConfirmationForm() {
    if (!this.confirmationForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateConfirmation);
      this.loading = true;
      this.report.contactAgreement = this.contactAgreementCtrl.value;
      this.reportService.createReport(this.report)
        .subscribe(
        result => {
          this.loading = false;
          this.reportService.removeReportFromStorage();
          this.reportService.changeReportFromStep(this.report, this.step);
          this.reportRouterService.routeForward(this.step);
        },
        error => {
          this.loading = false;
          // TODO cas d'erreur
        });

    }
  }

  getTimeSlotEnd() {
    if (this.report.details.anomalyTimeSlot) {
      return Number(this.report.details.anomalyTimeSlot) + 1;
    }
  }

}

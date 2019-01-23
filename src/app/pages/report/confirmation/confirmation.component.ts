import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../../../model/Report';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  @Input() report: Report;

  confirmationForm: FormGroup;
  contactAgreementCtrl: FormControl;

  showErrors: boolean;
  loading: boolean;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.initConfirmationForm();
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
      this.loading = true;
      this.report.contactAgreement = this.contactAgreementCtrl.value;
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.formSubmitted);
      this.reportService.createReport(this.report)
        .subscribe(
        result => {
          this.loading = false;
          //TODO
        },
        error => {
          this.loading = false;
          // TODO cas d'erreur
        });

    }
  }

}

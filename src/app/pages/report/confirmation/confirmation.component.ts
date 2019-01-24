import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Report } from '../../../model/Report';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { ReportService } from '../../../services/report.service';
import { Company } from '../../../model/Company';

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

  @Output() validate = new EventEmitter<Company>();

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
          this.validate.emit();
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

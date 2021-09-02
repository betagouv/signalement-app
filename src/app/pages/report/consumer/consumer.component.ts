import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/authentication.service';

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

  constructor(
    private authenticationService: AuthenticationService,
    public fb: FormBuilder,
    private reportStorageService: ReportStorageService,
    private reportRouterService: ReportRouterService,
    private analyticsService: AnalyticsService) {
    this.confirmationCodeCtrl.valueChanges.subscribe((value: string) => {
      this.confirmationCodeCtrl.setValue(value.replace(/[^\d]/g, '').slice(0, 6), { emitEvent: false });
    });
  }

  isEmailValid?: boolean;

  ngOnInit() {
    this.step = Step.Consumer;
    this.reportStorageService.retrieveReportInProgress()
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
    this.firstNameCtrl = this.fb.control(this.draftReport.consumer ? this.draftReport.consumer.firstName : '', Validators.required);
    this.lastNameCtrl = this.fb.control(this.draftReport.consumer ? this.draftReport.consumer.lastName : '', Validators.required);
    this.emailCtrl = this.fb.control(
      this.draftReport.consumer ? this.draftReport.consumer.email : '', [Validators.required, Validators.email]
    );

    this.consumerForm = this.fb.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl
    });

    if (!this.draftReport.isTransmittableToPro) {
      this.contactAgreementCtrl = this.fb.control(false);
    } else {
      this.contactAgreementCtrl = this.fb.control(
        this.draftReport.contactAgreement !== undefined ? this.draftReport.contactAgreement : this.draftReport.isContractualDispute ? true : undefined,
        Validators.required
      );
      this.consumerForm.addControl('contactAgreement', this.contactAgreementCtrl);
    }
  }

  readonly codePattern = /\d{6}/;

  confirmationCodeErrorMsg?: string;

  readonly confirmationCodeCtrl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.codePattern)
  ]);

  checkingEmail = false;

  readonly checkEmail = () => {
    this.checkingEmail = true;
    this.authenticationService.checkConsumerEmail(this.emailCtrl.value).subscribe(valid => {
      if (valid.valid) {
        this.submitConsumerForm();
      } else {
        this.isEmailValid = valid.valid;
      }
    }, () => {
    }, () => {
      setTimeout(() => {
        this.checkingEmail = false;
      }, 10000);
    });
  };

  readonly checkConfirmationCode = () => {
    if (this.confirmationCodeCtrl.valid) {
      if (this.codePattern.test(this.confirmationCodeCtrl.value)) {
        this.confirmationCodeErrorMsg = undefined;
        this.authenticationService.validateConsumerEmail(this.emailCtrl.value, this.confirmationCodeCtrl.value).subscribe(res => {
          if (res.valid) {
            this.submitConsumerForm();
          } else if (res.reason === 'TOO_MANY_ATTEMPTS') {
            this.confirmationCodeErrorMsg = 'Code expiré.';
          } else {
            this.confirmationCodeErrorMsg = 'Code incorrect. Veuillez réessayer.';
          }
        });
      }
    } else {
      this.confirmationCodeErrorMsg = 'Code incorrect. Veuillez réessayer.';
    }
  };

  readonly submitConsumerForm = () => {
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

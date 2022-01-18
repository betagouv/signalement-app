import { Component, OnInit } from '@angular/core';
import { DraftReport, Step } from '../../../model/Report';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { FileUploaderService } from '../../../services/file-uploader.service';
import { UploadedFile } from '../../../model/UploadedFile';
import { ReportService } from '../../../services/report.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';
import { CompanyKinds } from '@signal-conso/signalconso-api-sdk-js';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  step: Step;
  steps = Step;
  draftReport: DraftReport;
  companyKinds = CompanyKinds;

  confirmationForm: FormGroup;

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(public formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private reportService: ReportService,
    private reportStorageService: ReportStorageService,
    private reportRouterService: ReportRouterService,
    private fileUploaderService: FileUploaderService,
    private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.step = Step.Confirmation;
    this.reportStorageService.retrieveReportInProgress()
      .pipe(take(1))
      .subscribe(report => {
        if (report) {
          this.draftReport = report;
          this.initConfirmationForm();
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  initConfirmationForm() {
    this.showErrors = false;
    this.confirmationForm = this.formBuilder.group({});
  }

  submitConfirmationForm() {
    this.loadingError = false;
    if (!this.confirmationForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateConfirmation);
      this.loading = true;
      this.reportService.createReport(this.draftReport)
        .subscribe(report => {
          this.loading = false;
          this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.reportSendSuccess);
          this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
          this.reportRouterService.routeForward(this.step);
        }, error => {
          this.loading = false;
          this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.reportSendFail);
          this.loadingError = true;
          throw error;
        });
    }
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  goToStep(step: string) {
    this.reportRouterService.routeToStep(Step[step]);
  }

}

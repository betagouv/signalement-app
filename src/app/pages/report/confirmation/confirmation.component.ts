import { Component, OnInit } from '@angular/core';
import { Report, Step } from '../../../model/Report';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { FileUploaderService } from '../../../services/file-uploader.service';
import { UploadedFile } from '../../../model/UploadedFile';
import { ReportService } from '../../../services/report.service';
import { ReportStorageService } from '../../../services/report-storage.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  step: Step;
  report: Report;

  confirmationForm: FormGroup;

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private fileUploaderService: FileUploaderService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.step = Step.Confirmation;
    this.reportStorageService.reportInProgess.subscribe(report => {
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
    this.confirmationForm = this.formBuilder.group({});
  }

  submitConfirmationForm() {
    this.loadingError = false;
    if (!this.confirmationForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateConfirmation);
      this.loading = true;
      this.reportService.createReport(this.report)
        .subscribe(
        result => {
          this.loading = false;
          this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
          this.reportStorageService.removeReportInProgressFromStorage();
          this.reportRouterService.routeForward(this.step);
        },
        error => {
          this.loading = false;
          this.loadingError = true;
        });

    }
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  getReportLastSubcategory() {
    if (this.report && this.report.subcategories && this.report.subcategories.length) {
      return this.report.subcategories[this.report.subcategories.length - 1];
    }
  }

}

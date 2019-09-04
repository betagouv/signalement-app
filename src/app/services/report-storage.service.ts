import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DetailInputValue, Report, Step } from '../model/Report';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UploadedFile } from '../model/UploadedFile';

const ReportStorageKey = 'ReportSignalConso';

@Injectable({
  providedIn: 'root'
})
export class ReportStorageService {

  private reportInProgessSource = new BehaviorSubject<Report>(undefined);
  reportInProgess = this.reportInProgessSource.asObservable();

  constructor(private localStorage: LocalStorage) {
    console.log('ReportStorageService');
  }

  retrieveReportInProgressFromStorage() {
    this.localStorage.getItem(ReportStorageKey).subscribe((report: Report) => {
      if (report) {
        report.retrievedFromStorage = true;
        // To force class method to be valuate
        if (report.detailInputValues) {
          report.detailInputValues = report.detailInputValues.map(d => Object.assign(new DetailInputValue(), d));
        }
        if (report.uploadedFiles) {
          report.uploadedFiles = report.uploadedFiles.map(f => Object.assign(new UploadedFile(), f));
        }
        this.reportInProgessSource.next(report);
      }
    });
    return this.reportInProgess;
  }

  removeReportInProgress() {
    this.removeReportInProgressFromStorage();
    this.reportInProgessSource.next(undefined);
  }

  removeReportInProgressFromStorage() {
    if (this.reportInProgessSource.getValue()) {
      this.reportInProgessSource.getValue().retrievedFromStorage = false;
    }
    this.localStorage.removeItemSubscribe(ReportStorageKey);
  }

  changeReportInProgressFromStep(report: Report, step: Step) {
    report.retrievedFromStorage = false;
    report.storedStep = step;
    this.reportInProgessSource.next(report);
    if (step === Step.Category) {
      this.removeReportInProgressFromStorage();
    } else {
      this.localStorage.setItemSubscribe(ReportStorageKey, report);
    }
  }

  changeReportInProgress(report: Report) {
    this.reportInProgessSource.next(report);
  }
}

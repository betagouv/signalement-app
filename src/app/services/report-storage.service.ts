import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DetailInputValue, Report } from '../model/Report';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UploadedFile } from '../model/UploadedFile';
import { Step } from './report-router.service';

const ReportStorageKey = 'ReportSignalConso';

@Injectable({
  providedIn: 'root'
})
export class ReportStorageService {

  private reportInProgessSource = new BehaviorSubject<Report>(undefined);
  reportInProgess = this.reportInProgessSource.asObservable();

  constructor(private localStorage: LocalStorage) {
    this.retrieveReportInProgressFromStorage();
  }

  private retrieveReportInProgressFromStorage() {
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
  }

  removeReportInProgress() {
    this.removeReportInProgressFromStorage();
    this.reportInProgessSource.next(undefined);
  }

  removeReportInProgressFromStorage() {
    this.reportInProgessSource.getValue().retrievedFromStorage = false;
    this.localStorage.removeItemSubscribe(ReportStorageKey);
  }

  changeReportInProgressFromStep(report: Report, step: Step) {
    report.retrievedFromStorage = false;
    report.storedStep = step;
    this.reportInProgessSource.next(report);
    this.localStorage.setItemSubscribe(ReportStorageKey, report);
  }
}

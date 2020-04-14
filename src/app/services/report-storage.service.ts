import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DetailInputValue, DraftReport, Step } from '../model/Report';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UploadedFile } from '../model/UploadedFile';
import { CompanySearchResult } from '../model/CompanySearchResult';
import { CompanyKinds } from '../model/Anomaly';
import { Website } from '../model/Company';

const ReportStorageKey = 'ReportSignalConso';

@Injectable({
  providedIn: 'root'
})
export class ReportStorageService {

  private reportInProgessSource = new BehaviorSubject<DraftReport>(undefined);
  reportInProgess = this.reportInProgessSource.asObservable();

  constructor(private localStorage: LocalStorage) {
  }

  retrieveReportInProgressFromStorage() {
    this.localStorage.getItem(ReportStorageKey).subscribe((draftReport: DraftReport) => {
      if (draftReport) {
        draftReport = Object.assign(new DraftReport(), draftReport);
        draftReport.retrievedFromStorage = true;
        // To force class method to be valuate
        if (draftReport.detailInputValues) {
          draftReport.detailInputValues = draftReport.detailInputValues.map(d => Object.assign(new DetailInputValue(), d));
        }
        if (draftReport.uploadedFiles) {
          draftReport.uploadedFiles = draftReport.uploadedFiles.map(f => Object.assign(new UploadedFile(), f));
        }
        if (draftReport.companyData) {
          console.log('draftReport.companyData', draftReport.companyKind)
          switch (draftReport.companyKind) {
            case CompanyKinds.SIRET:
              draftReport.companyData = Object.assign(new CompanySearchResult(), draftReport.companyData);
              return;
            case CompanyKinds.WEBSITE:
              draftReport.companyData = Object.assign(new Website(), draftReport.companyData);
              return;
          }
        }
        this.reportInProgessSource.next(draftReport);
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

  changeReportInProgressFromStep(draftReport: DraftReport, step: Step) {
    draftReport.retrievedFromStorage = false;
    draftReport.storedStep = step;
    this.reportInProgessSource.next(draftReport);
    if (step === Step.Category) {
      this.removeReportInProgressFromStorage();
    } else {
      this.localStorage.setItemSubscribe(ReportStorageKey, draftReport);
    }
  }

  changeReportInProgress(draftReport: DraftReport) {
    this.reportInProgessSource.next(draftReport);
  }
}

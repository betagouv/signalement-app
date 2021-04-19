import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DetailInputValue, DraftReport, Step } from '../model/Report';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UploadedFile } from '../model/UploadedFile';
import { WebsiteURL } from '../model/Company';
import { switchMap, take, tap } from 'rxjs/operators';

export const ReportStorageKey = 'ReportSignalConso';

@Injectable({
  providedIn: 'root'
})
export class ReportStorageService {

  private reportInProgessSource = new BehaviorSubject<DraftReport>(undefined);
  private reportInProgess = this.reportInProgessSource.asObservable();

  constructor(private localStorage: LocalStorage) {
  }

  private retrieveReportInProgressFromStorage() {
    return this.localStorage.getItem(ReportStorageKey).pipe(
      tap(draftReport => {
        if (draftReport) {
          draftReport = Object.assign(new DraftReport(), draftReport);
          // To force class method to be valuate
          if (draftReport.detailInputValues) {
            draftReport.detailInputValues = draftReport.detailInputValues.map(d => Object.assign(new DetailInputValue(), d));
          }
          if (draftReport.uploadedFiles) {
            draftReport.uploadedFiles = draftReport.uploadedFiles.map(f => Object.assign(new UploadedFile(), f));
          }
          this.reportInProgessSource.next(draftReport);
        }
      })
    );
  }

  retrieveReportInProgress() {
    if (!this.reportInProgessSource.getValue()) {
      return this.retrieveReportInProgressFromStorage().pipe(
        switchMap(_ => this.reportInProgess.pipe(take(1)))
      );
    } else {
      return this.reportInProgess.pipe(take(1));
    }
  }

  removeReportInProgress() {
    this.removeReportInProgressFromStorage();
    this.reportInProgessSource.next(undefined);
  }

  private removeReportInProgressFromStorage() {
    this.localStorage.removeItemSubscribe(ReportStorageKey);
  }

  changeReportInProgressFromStep(draftReport: DraftReport, step: Step) {
    draftReport.storedStep = step;
    this.reportInProgessSource.next(draftReport);
    if ([Step.Category, Step.Confirmation, Step.Information].indexOf(step) !== -1) {
      this.removeReportInProgressFromStorage();
    } else {
      this.localStorage.setItemSubscribe(ReportStorageKey, draftReport);
    }
  }
}

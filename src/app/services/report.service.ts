import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { DetailInputValue, Report, Step } from '../model/Report';
import { Company } from '../model/Company';
import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';

const ReportStorageKey = 'ReportSignalConso';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  private reportSource = new BehaviorSubject<Report>(undefined);
  currentReport = this.reportSource.asObservable();

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils,
              private localStorage: LocalStorage) {

    this.retrieveReportFromStorage();

  }

  private retrieveReportFromStorage() {
    this.localStorage.getItem(ReportStorageKey).subscribe((report: Report) => {
      if (report) {
        report.retrievedFromStorage = true;
        if (report.detailInputValues) {
          // To force class method to be valuate
          report.detailInputValues = report.detailInputValues.map(d => Object.assign(new DetailInputValue(), d));
        }
        this.reportSource.next(report);
      }
    });
  }

  removeReport() {
    this.removeReportFromStorage();
    this.reportSource.next(undefined);
  }

  removeReportFromStorage() {
    this.reportSource.getValue().retrievedFromStorage = false;
    this.localStorage.removeItemSubscribe(ReportStorageKey);
  }

  changeReportFromStep(report: Report, step: Step) {
    report.retrievedFromStorage = false;
    report.storedStep = step;
    this.reportSource.next(report);
    if (step === Step.Category) {
      this.removeReportFromStorage();
    } else {
      this.localStorage.setItemSubscribe(ReportStorageKey, report);
    }
  }

  uploadFile(file: File) {
    const fileFormData: FormData = new FormData();
    fileFormData.append('reportFile', file, file.name);
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports', 'files']),
      fileFormData,
    );
  }

  createReport(report: Report) {
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
      this.generateReportToPost(report),
    );
  }

  private generateReportToPost(report: Report) {
    const reportToPost = {
      category: report.category,
      subcategories: report.subcategories.map(subcategory => subcategory.title),
      companyName: report.company.name,
      companyAddress: this.getCompanyAddress(report.company),
      companyPostalCode: report.company.postalCode,
      companySiret: report.company.siret,
      firstName: report.consumer.firstName,
      lastName: report.consumer.lastName,
      email: report.consumer.email,
      contactAgreement: report.contactAgreement,
      fileIds: report.uploadedFiles.map(f => f.id),
      details: report.detailInputValues.map(detailInputValue => {
        return {
          label: detailInputValue.renderedLabel,
          value: detailInputValue.renderedValue,
        };
      })
    };
    return reportToPost;
  }


  getCompanyAddress(company: Company) {
    let address = '';
    const addressAttibutes = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7'];
    if (company) {
      for (const attribute of addressAttibutes) {
        if (company[attribute]) {
          address = address.concat(`${company[attribute]} - `);
        }
      }
    }
    return address.substring(0, address.length - 3);
  }
}

export const otherPrecisionValue = 'Autre';


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { DetailInputValue, Report, ReportDetails } from '../model/Report';
import moment from 'moment';
import { Company } from '../model/Company';
import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Step } from './report-router.service';

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
    this.localStorage.setItemSubscribe(ReportStorageKey, report);
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
      'category': report.category,
      'subcategories': report.subcategories.map(subcategory => subcategory.title),
      'companyName': report.company.name,
      'companyAddress': this.getCompanyAddress(report.company),
      'companyPostalCode': report.company.postalCode,
      'companySiret': report.company.siret,
      'firstName': report.consumer.firstName,
      'lastName': report.consumer.lastName,
      'email': report.consumer.email,
      'contactAgreement': report.contactAgreement,
      'fileIds': report.uploadedFiles.map(f => f.id)
    };
    if (report.detailInputValues) {
      reportToPost['details'] = report.detailInputValues.map(detailInputValue => {
        return {
          label: detailInputValue.renderedLabel,
          value: detailInputValue.renderedValue,
        };
      });
    }
    if (report.details) {
      if (report.details.precision) {
        reportToPost['details'] = [{ label: 'Précision :', value: this.getDetailsPrecision(report.details) }];
      }
      reportToPost['anomalyDate'] = moment(report.details.anomalyDate).format('YYYY-MM-DD');
      reportToPost['description'] = report.details.description;
      if (report.details.anomalyTimeSlot) {
        reportToPost['anomalyTimeSlot'] = Number(report.details.anomalyTimeSlot);
      }
    }
    return reportToPost;
  }

  getDetailsPrecision(details: ReportDetails) {
    let precision = '';
    if (typeof details.precision  === 'string') {
      precision = details.precision;
      if (precision === otherPrecisionValue && details.otherPrecision) {
        precision =  `${precision} (${details.otherPrecision})`;
      }
    } else {
      precision = details.precision.join(', ');
      if (precision.indexOf(otherPrecisionValue) !== -1 && details.otherPrecision) {
        precision = precision.replace(otherPrecisionValue, `${otherPrecisionValue} (${details.otherPrecision})`);
      }
    }
    return precision;
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


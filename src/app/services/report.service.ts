import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { DetailInputValue, Report } from '../model/Report';
import { Company } from '../model/Company';
import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Step } from './report-router.service';
import { PaginatedData } from '../model/PaginatedData';
import { map } from 'rxjs/operators';
import { Consumer } from '../model/Consumer';
import { UploadedFile } from '../model/UploadedFile';

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
        // To force class method to be valuate
        if (report.detailInputValues) {
          report.detailInputValues = report.detailInputValues.map(d => Object.assign(new DetailInputValue(), d));
        }
        if (report.uploadedFiles) {
          report.uploadedFiles = report.uploadedFiles.map(f => Object.assign(new UploadedFile(), f));
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
      files: report.uploadedFiles,
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

  getReports(offset: number, limit: number, codeDepartement?: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', offset.toString());
    httpParams = httpParams.append('limit', limit.toString());
    if (codeDepartement) {
      httpParams = httpParams.append('codePostal', codeDepartement);
    }
    return this.http.get<PaginatedData<any>>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
      Object.assign(this.serviceUtils.getAuthHeaders(), { params: httpParams })
    ).pipe(
      map(paginatedData => Object.assign(new PaginatedData<Report>(), {
        totalCount: paginatedData.totalCount,
        hasNextPage: paginatedData.hasNextPage,
        entities: paginatedData.entities.map(entity => Object.assign(new Report(), {
          id: entity.id,
          creationDate: entity.creationDate,
          category: entity.category,
          subcategories: entity.subcategories,
          detailInputValues: entity.details,
          company: Object.assign(new Company(), {
            name: entity.companyName,
            siret: entity.companySiret,
            postalCode: entity.companyPostalCode,
            line1: entity.companyAddress.split('-')[0],
            line2: entity.companyAddress.split('-')[1],
            line3: entity.companyAddress.split('-')[2],
            line4: entity.companyAddress.split('-')[3],
            line5: entity.companyAddress.split('-')[4],
            line6: entity.companyAddress.split('-')[5],
            line7: entity.companyAddress.split('-')[6],
          }),
          consumer: Object.assign(new Consumer(), {
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email
          }),
          files: entity.files.map(f => Object.assign(new UploadedFile(), f))
        }))
      }))
    );
  }
}

export const otherPrecisionValue = 'Autre';


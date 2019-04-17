import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { DetailInputValue, Report } from '../model/Report';
import { Company } from '../model/Company';
import { BehaviorSubject, of } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Step } from './report-router.service';
import { PaginatedData } from '../model/PaginatedData';
import { mergeMap } from 'rxjs/operators';
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
      this.report2reportApi(report),
    );
  }

  getReport(reportId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<PaginatedData<any>>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId]),
          headers
        );
      }),
      mergeMap(reportApi => of(this.reportApi2report(reportApi)))
    );
  }

  getReports(offset: number, limit: number, codeDepartement?: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', offset.toString());
    httpParams = httpParams.append('limit', limit.toString());
    if (codeDepartement) {
      httpParams = httpParams.append('codePostal', codeDepartement);
    }
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<PaginatedData<any>>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
          Object.assign(headers, { params: httpParams })
        );
      }),
      mergeMap(paginatedData => {
        return of(Object.assign(new PaginatedData<Report>(), {
          totalCount: paginatedData.totalCount,
          hasNextPage: paginatedData.hasNextPage,
          entities: paginatedData.entities.map(entity => this.reportApi2report(entity))
        }));
      })
    );
  }

  private report2reportApi(report: Report) {
    const reportApi = {
      category: report.category,
      subcategories: report.subcategories.map(subcategory => subcategory.title),
      companyName: report.company.name,
      companyAddress: this.company2adresseApi(report.company),
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
    return reportApi;
  }

  private company2adresseApi(company: Company) {
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

  private reportApi2report(reportApi) {
    return Object.assign(new Report(), {
      id: reportApi.id,
      creationDate: reportApi.creationDate,
      category: reportApi.category,
      subcategories: reportApi.subcategories,
      detailInputValues: reportApi.details,
      company: Object.assign(new Company(), {
        name: reportApi.companyName,
        siret: reportApi.companySiret,
        postalCode: reportApi.companyPostalCode,
        line1: reportApi.companyAddress.split('-')[0],
        line2: reportApi.companyAddress.split('-')[1],
        line3: reportApi.companyAddress.split('-')[2],
        line4: reportApi.companyAddress.split('-')[3],
        line5: reportApi.companyAddress.split('-')[4],
        line6: reportApi.companyAddress.split('-')[5],
        line7: reportApi.companyAddress.split('-')[6],
      }),
      consumer: Object.assign(new Consumer(), {
        firstName: reportApi.firstName,
        lastName: reportApi.lastName,
        email: reportApi.email
      }),
      uploadedFiles: reportApi.files.map(f => Object.assign(new UploadedFile(), f))
    });
  }
}


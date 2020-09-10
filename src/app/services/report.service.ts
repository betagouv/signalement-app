import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { DetailInputValue, DraftReport, Report } from '../model/Report';
import { of } from 'rxjs';
import { PaginatedData } from '../model/PaginatedData';
import { mergeMap } from 'rxjs/operators';
import { Consumer } from '../model/Consumer';
import { UploadedFile } from '../model/UploadedFile';
import { ReportFilter } from '../model/ReportFilter';
import moment from 'moment';
import { ReportAction, ReportResponse, ReviewOnReportResponse } from '../model/ReportEvent';
import { Company, CompanySearchResult, Website } from '../model/Company';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  private _currentReportFilter = new ReportFilter();

  get currentReportFilter() {
    return this._currentReportFilter;
  }

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  createReport(draftReport: DraftReport) {
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
      {
        category: draftReport.category,
        subcategories: !draftReport.subcategories ? [] : draftReport.subcategories
          .map(subcategory => subcategory.title ? subcategory.title : subcategory),
        tags: !draftReport.subcategories ? [] : [].concat(...draftReport.subcategories.map(subcategory => subcategory.tags || [])),
        firstName: draftReport.consumer.firstName,
        lastName: draftReport.consumer.lastName,
        email: draftReport.consumer.email,
        contactAgreement: draftReport.contactAgreement,
        employeeConsumer: draftReport.employeeConsumer,
        fileIds: draftReport.uploadedFiles.map(file => file.id),
        details: draftReport.detailInputValues
          .map(d => Object.assign(new DetailInputValue(), d))
          .map(detailInputValue => {
            return {
              label: detailInputValue.renderedLabel,
              value: detailInputValue.renderedValue,
            };
          }),
        companyName: draftReport.draftCompany.name,
        companyAddress: draftReport.draftCompany.address,
        companyPostalCode: draftReport.draftCompany.postalCode,
        companySiret: draftReport.draftCompany.siret,
        websiteURL: draftReport.draftCompany.website ? draftReport.draftCompany.website.url : undefined,
      },
    );
  }

  deleteReport(reportId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.delete(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId]),
          headers
        );
      }),
    );
  }

  updateReportCompany(reportId: string, companySearchResult: CompanySearchResult) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post<Report> (
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'company']),
          {
            name: companySearchResult.name,
            address: companySearchResult.address,
            postalCode: companySearchResult.postalCode,
            siret: companySearchResult.siret,
          },
          headers
        );
      }),
    );
  }

  updateReportConsumer(reportId: string, consumer: Consumer, contactAgreement: boolean) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'consumer']),
          {
            firstName: consumer.firstName,
            lastName: consumer.lastName,
            email: consumer.email,
            contactAgreement
          },
          headers
        );
      }),
    );
  }

  postReportResponse(reportId: string, reportResponse: ReportResponse) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'response']),
          reportResponse,
          headers
        );
      }),
    );
  }

  postReportAction(reportId: string, reportAction: ReportAction) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'action']),
          reportAction,
          headers
        );
      }),
    );
  }

  postReviewOnReportResponse(reportId: string, reviewOnReportResponse: ReviewOnReportResponse) {
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'response', 'review']),
        reviewOnReportResponse
    ) ;
  }

  getReport(reportId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<{report: any, files: UploadedFile[]}>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId]),
          headers
        );
      }),
      mergeMap(reportApi => of(this.reportApi2report(reportApi)))
    );
  }

  downloadReport(reportId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get(
          `${this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'download'])}`,
          Object.assign(headers, {responseType: 'blob', observe: 'response' })
        );
      })
    );
  }

  getNbReportsGroupByCompany(offset: number, limit: number) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', offset.toString());
    httpParams = httpParams.append('limit', limit.toString());

    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<PaginatedData<any>>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'nbReportsGroupByCompany']),
          Object.assign(headers, { params: httpParams })
        );
      }),
      mergeMap(paginatedData => {
        return of(Object.assign(new PaginatedData<Report>(), {
          totalCount: paginatedData.totalCount,
          hasNextPage: paginatedData.hasNextPage,
          entities: paginatedData.entities
        }));
      })
    );

  }

  getReports(offset: number, limit: number, reportFilter: ReportFilter) {
    this._currentReportFilter = reportFilter;
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', offset.toString());
    httpParams = httpParams.append('limit', limit.toString());
    if (reportFilter.departments && reportFilter.departments.length) {
      httpParams = httpParams.append('departments', reportFilter.departments.map(d => d.code).join(','));
    }
    if (reportFilter.period && reportFilter.period[0]) {
      httpParams = httpParams.append('start', moment(reportFilter.period[0]).format('YYYY-MM-DD'));
    }
    if (reportFilter.period && reportFilter.period[1]) {
      httpParams = httpParams.append('end', moment(reportFilter.period[1]).format('YYYY-MM-DD'));
    }

    ['siret', 'status', 'category', 'details', 'email', 'hasCompany', 'tags'].forEach(filterName => {
      if (reportFilter[filterName] && reportFilter[filterName].length) {
        httpParams = httpParams.append(filterName, (reportFilter[filterName].toString()).trim());
      }
    });
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

  launchExtraction(reportFilter: ReportFilter) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        const params = {};
        params['departments'] = (reportFilter.departments || []).map(d => d.code);
        if (reportFilter.period && reportFilter.period[0]) {
          params['start'] = moment(reportFilter.period[0]).format('YYYY-MM-DD');
        }
        if (reportFilter.period && reportFilter.period[1]) {
          params['end'] = moment(reportFilter.period[1]).format('YYYY-MM-DD');
        }
        ['siret', 'status', 'category', 'details', 'hasCompany'].forEach(filterName => {
          if (reportFilter[filterName]) {
            params[filterName] = (reportFilter[filterName] as string).trim();
          }
        });
        params['tags'] = (reportFilter.tags || []);
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', 'extract']),
          params,
          headers
        );
      })
    );
  }

  private reportApi2report(reportWithFiles: {report: any, files: UploadedFile[]}) {
    const report = reportWithFiles.report;
    const files = reportWithFiles.files;
    return Object.assign(new Report(), {
      id: report.id,
      creationDate: new Date(report.creationDate),
      category: report.category,
      subcategories: report.subcategories,
      tags: report.tags,
      detailInputValues: report.details,
      company: Object.assign(<Company>{
        name: report.companyName,
        siret: report.companySiret,
        address: report.companyAddress,
        postalCode: report.companyPostalCode
      }),
      consumer: Object.assign(new Consumer(), {
        firstName: report.firstName,
        lastName: report.lastName,
        email: report.email
      }),
      website: Object.assign(new Website(), {url: report.websiteURL}),
      contactAgreement: report.contactAgreement,
      employeeConsumer: report.employeeConsumer,
      uploadedFiles: files.map(f => Object.assign(new UploadedFile(), f)),
      status: report.status
    });
  }
}


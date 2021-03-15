import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './core/service.utils';
import { DetailInputValue, DraftReport, Report } from '../model/Report';
import { Observable, of, pipe } from 'rxjs';
import { PaginatedData } from '../model/PaginatedData';
import { mergeMap } from 'rxjs/operators';
import { Consumer } from '../model/Consumer';
import { UploadedFile } from '../model/UploadedFile';
import { cleanReportFilter, ReportFilter, reportFilter2Body, reportFilter2QueryString } from '../model/ReportFilter';
import { ReportAction, ReportResponse, ReviewOnReportResponse } from '../model/ReportEvent';
import { Company, CompanySearchResult, DraftCompany, WebsiteURL } from '../model/Company';
import Utils from '../utils';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  get currentReportFilter() {
    return this._currentReportFilter;
  }

  constructor(private http: HttpClient,
    private serviceUtils: ServiceUtils) {
  }

  private _currentReportFilter: ReportFilter = {};

  createReport(draftReport: DraftReport) {
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
      {
        category: draftReport.category,
        subcategories: !draftReport.subcategories ? [] : draftReport.subcategories
          .map(subcategory => subcategory.title ? subcategory.title : subcategory),
        tags: draftReport.tags,
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
        companyAddress: this.getDraftCompanyFullAddress(draftReport.draftCompany),
        companyPostalCode: draftReport.draftCompany.postalCode,
        companyCountry: draftReport.draftCompany.country,
        companySiret: draftReport.draftCompany.siret,
        companyActivityCode: draftReport.draftCompany.activityCode,
        websiteURL: draftReport.draftCompany.website ? draftReport.draftCompany.website.url : undefined,
        phone: draftReport.draftCompany.phone,
        vendor: draftReport.vendor
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
        return this.http.post (
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'company']),
          {
            name: companySearchResult.name,
            address: this.getDraftCompanyFullAddress(companySearchResult),
            postalCode: companySearchResult.postalCode,
            siret: companySearchResult.siret,
            activityCode: companySearchResult.activityCode,
          },
          headers
        );
      }),
      mergeMap(report => of(this.reportApi2report({ report })))
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
          { ...headers, responseType: 'blob', observe: 'response' },
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
    );
  }

  getReports(report: ReportFilter = {}): Observable<PaginatedData<Report>> {
    this._currentReportFilter = report;
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => this.http.get<PaginatedData<any>>(
        this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
        {
          ...headers,
          params: pipe(
            Utils.cleanObject,
            cleanReportFilter,
            reportFilter2QueryString,
            this.serviceUtils.objectToHttpParams,
          )(report)
        },
      )),
      mergeMap(paginatedData => of({
        ...paginatedData,
        entities: paginatedData.entities.map(entity => this.reportApi2report(entity))
      }))
    );
  }

  launchExtraction(report: ReportFilter) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => this.http.post(
        this.serviceUtils.getUrl(Api.Report, ['api', 'reports', 'extract']),
        pipe(Utils.cleanObject, cleanReportFilter, reportFilter2Body)(report),
        headers
      ))
    );
  }

  private reportApi2report = (reportWithFiles: {report: any, files?: UploadedFile[]}) => {
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
        postalCode: report.companyPostalCode,
        country: report.companyCountry,
      }),
      consumer: Object.assign(new Consumer(), {
        firstName: report.firstName,
        lastName: report.lastName,
        email: report.email
      }),
      website: Object.assign(new WebsiteURL(), { url: report.websiteURL }),
      vendor: report.vendor,
      phone: report.phone,
      contactAgreement: report.contactAgreement,
      employeeConsumer: report.employeeConsumer,
      uploadedFiles: files ? files.map(f => Object.assign(new UploadedFile(), f)) : [],
      status: report.status
    });
  }

  private getDraftCompanyFullAddress(draftCompany: DraftCompany) {
    return [draftCompany.name, draftCompany.brand, draftCompany.address]
      .filter(a => a && a.length)
      .join(' - ');
  }
}


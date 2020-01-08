import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { DetailInputValue, Report } from '../model/Report';
import { Company } from '../model/Company';
import { of } from 'rxjs';
import { PaginatedData } from '../model/PaginatedData';
import { map, mergeMap } from 'rxjs/operators';
import { Consumer } from '../model/Consumer';
import { UploadedFile } from '../model/UploadedFile';
import { ReportFilter } from '../model/ReportFilter';
import moment from 'moment';
import { ReportResponse } from '../model/ReportEvent';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  createReport(report: Report) {
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
      {
        id: report.id,
        category: report.category,
        subcategories: !report.subcategories ? [] : report.subcategories
          .map(subcategory => subcategory.title ? subcategory.title : subcategory),
        companyName: report.company.name,
        companyAddress: this.company2Address(report.company),
        companyPostalCode: report.company.postalCode,
        companySiret: report.company.siret,
        firstName: report.consumer.firstName,
        lastName: report.consumer.lastName,
        email: report.consumer.email,
        contactAgreement: report.contactAgreement,
        employeeConsumer: report.employeeConsumer,
        fileIds: report.uploadedFiles.map(file => file.id),
        details: report.detailInputValues
          .map(d => Object.assign(new DetailInputValue(), d))
          .map(detailInputValue => {
            return {
              label: detailInputValue.renderedLabel,
              value: detailInputValue.renderedValue,
            };
          })
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

  updateReportCompany(reportId: string, company: Company) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports', reportId, 'company']),
          {
            name: company.name,
            address: this.company2Address(company),
            postalCode: company.postalCode,
            siret: company.siret,
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

    ['siret', 'status', 'category', 'details'].forEach(filterName => {
      if (reportFilter[filterName]) {
        httpParams = httpParams.append(filterName, (reportFilter[filterName] as string).trim());
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

  getReportExtractUrl(reportFilter: ReportFilter) {
    return this.serviceUtils.getAuthHttpParam().pipe(
      map(param => {
        const url = this.serviceUtils.getUrl(Api.Report, ['api', 'reports', 'extract']);
        const httpParams = [param];
        if (reportFilter.departments && reportFilter.departments.length) {
          httpParams.push(`departments=${reportFilter.departments.map(d => d.code).join(',')}`);
        }
        if (reportFilter.period && reportFilter.period[0]) {
          httpParams.push(`start=${moment(reportFilter.period[0]).format('YYYY-MM-DD')}`);
        }
        if (reportFilter.period && reportFilter.period[1]) {
          httpParams.push(`end=${moment(reportFilter.period[1]).format('YYYY-MM-DD')}`);
        }

        ['siret', 'status', 'category', 'details'].forEach(filterName => {
          if (reportFilter[filterName]) {
            httpParams.push(`${filterName}=${encodeURIComponent((reportFilter[filterName] as string).trim())}`);
          }
        });
        return `${url}?${httpParams.join('&')}`;
      })
    );
  }

  company2Address(company: Company) {
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

  private reportApi2report(reportWithFiles: {report: any, files: UploadedFile[]}) {
    const report = reportWithFiles.report;
    const files = reportWithFiles.files;
    return Object.assign(new Report(), {
      id: report.id,
      creationDate: new Date(report.creationDate),
      category: report.category,
      subcategories: report.subcategories,
      detailInputValues: report.details,
      company: Object.assign(new Company(), {
        name: report.companyName,
        siret: report.companySiret,
        postalCode: report.companyPostalCode,
        line1: report.companyAddress.split('-')[0],
        line2: report.companyAddress.split('-')[1],
        line3: report.companyAddress.split('-')[2],
        line4: report.companyAddress.split('-')[3],
        line5: report.companyAddress.split('-')[4],
        line6: report.companyAddress.split('-')[5],
        line7: report.companyAddress.split('-')[6],
      }),
      consumer: Object.assign(new Consumer(), {
        firstName: report.firstName,
        lastName: report.lastName,
        email: report.email
      }),
      contactAgreement: report.contactAgreement,
      employeeConsumer: report.employeeConsumer,
      uploadedFiles: files.map(f => Object.assign(new UploadedFile(), f)),
      status: report.status
    });
  }
}


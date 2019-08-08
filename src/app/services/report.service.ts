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
import { Region, ReportFilter } from '../model/ReportFilter';
import moment from 'moment';

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
      this.report2reportApi(report),
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

  updateReport(report: Report) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.put(
          this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
          this.report2reportApi(report),
          headers
        );
      }),
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

  getReports(offset: number, limit: number, reportFilter: ReportFilter) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('offset', offset.toString());
    httpParams = httpParams.append('limit', limit.toString());
    if (reportFilter.area) {
      if (reportFilter.area instanceof Region) {
        httpParams = httpParams.append('departments', (reportFilter.area as Region).departments.map(d => d.code).join(','));
      } else {
        httpParams = httpParams.append('departments', reportFilter.area.code);
      }
    }
    if (reportFilter.period && reportFilter.period[0]) {
      httpParams = httpParams.append('start', moment(reportFilter.period[0]).format('YYYY-MM-DD'));
    }
    if (reportFilter.period && reportFilter.period[1]) {
      httpParams = httpParams.append('end', moment(reportFilter.period[1]).format('YYYY-MM-DD'));
    }
    ['siret', 'statusPro', 'statusConso', 'category', 'details'].forEach(filterName => {
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
        if (reportFilter.area) {
          if (reportFilter.area instanceof Region) {
            httpParams.push(`departments=${(reportFilter.area as Region).departments.map(d => d.code).join(',')}`);
          } else {
            httpParams.push(`departments=${reportFilter.area.code}`);
          }
        }
        if (reportFilter.period && reportFilter.period[0]) {
          httpParams.push(`start=${moment(reportFilter.period[0]).format('YYYY-MM-DD')}`);
        }
        if (reportFilter.period && reportFilter.period[1]) {
          httpParams.push(`end=${moment(reportFilter.period[1]).format('YYYY-MM-DD')}`);
        }
        ['siret', 'statusPro', 'statusConso', 'category', 'details'].forEach(filterName => {
          if (reportFilter[filterName]) {
            httpParams.push(`${filterName}=${encodeURIComponent((reportFilter[filterName] as string).trim())}`);
          }
        });
        return `${url}?${httpParams.join('&')}`;
      })
    );
  }

  private report2reportApi(report: Report) {
    const reportApi = {
      id: report.id,
      category: report.category,
      subcategories: !report.subcategories ? [] : report.subcategories.map(subcategory => subcategory.title ? subcategory.title : subcategory),
      companyName: report.company.name,
      companyAddress: this.company2adresseApi(report.company),
      companyPostalCode: report.company.postalCode,
      companySiret: report.company.siret,
      firstName: report.consumer.firstName,
      lastName: report.consumer.lastName,
      email: report.consumer.email,
      contactAgreement: report.contactAgreement,
      files: report.uploadedFiles,
      details: report.detailInputValues
        .map(d => Object.assign(new DetailInputValue(), d))
        .map(detailInputValue => {
          return {
            label: detailInputValue.renderedLabel,
            value: detailInputValue.renderedValue,
          };
        })
    };
    return reportApi;
  }

  company2adresseApi(company: Company) {
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
      creationDate: new Date(reportApi.creationDate),
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
      contactAgreement: reportApi.contactAgreement,
      uploadedFiles: reportApi.files.map(f => Object.assign(new UploadedFile(), f)),
      statusPro: reportApi.statusPro,
      statusConso: reportApi.statusConso
    });
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { MonthlyStat, SimpleStat, Statistics } from '../model/Statistics';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  getStatistics() {
    return this.http.get<Statistics>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats']));
  }

  getReportCount() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports']));
  }

  getMonthlyReportCount() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'monthly']));
  }

  getReportReadByProPercentage() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'read']));
  }

  getMonthlyReportReadByProPercentage() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'monthly', 'read']));
  }

  getReportWithResponsePercentage() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'responsed']));
  }

  getMonthlyReportWithResponsePercentage() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'monthly', 'responsed']));
  }
}

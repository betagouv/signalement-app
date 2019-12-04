import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { MonthlyStat, SimpleStat } from '../model/Statistics';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  getReportCount() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'count']));
  }

  getMonthlyReportCount() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'count', 'monthly']));
  }

  getReportReadByProPercentage() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'read', 'percentage']));
  }

  getMonthlyReportReadByProPercentage() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'read', 'percentage', 'monthly']));
  }

  getReportReadByProMedianDelay() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<SimpleStat>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'read', 'delay']),
          headers
        );
      })
    );
  }

  getReportWithResponsePercentage() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'responsed', 'percentage']));
  }

  getMonthlyReportWithResponsePercentage() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'responsed', 'percentage', 'monthly']));
  }

  getReportWithResponseMedianDelay() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<SimpleStat>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'responsed', 'delay']),
          headers
        );
      })
    );
  }

}

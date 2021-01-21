import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { MonthlyStat, SimpleStat } from '../model/Statistics';
import { mergeMap, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { iif, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  reportCountKey = makeStateKey<SimpleStat>('reportCount');

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils,
              private transferState: TransferState) {
  }

  getReportCount() {
    return iif(() => this.transferState.hasKey(this.reportCountKey),
      of(this.transferState.get(this.reportCountKey, { value: 0 })).pipe(
        tap(_ => this.transferState.remove(this.reportCountKey))
      ),
      this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'count'])).pipe(
        tap(reportCount => this.transferState.set(this.reportCountKey, reportCount))
      )
    );
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

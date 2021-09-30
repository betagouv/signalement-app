import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './core/service.utils';
import { MonthlyStat, SimpleStat } from '../model/Statistics';
import { FetchService } from './helper/FetchService';
import { CompanySearchResult } from '@betagouv/signalconso-api-sdk-js';
import { ApiSdkService } from './core/api-sdk.service';

@Injectable({ providedIn: 'root' })
export class ReportCountService extends FetchService<SimpleStat[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getReportCount);
  }
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  //
  getReportCount() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'count']));
  }

  getMonthlyReportCount() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'count', 'monthly']));
  }

  getReportForwardedToProPercentage() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'forwarded', 'percentage']));
  }

  getReportReadByProPercentage() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'read', 'percentage']));
  }

  getMonthlyReportForwardedToProPercentage() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'forwarded', 'percentage', 'monthly']));
  }

  getMonthlyReportReadByProPercentage() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'read', 'percentage', 'monthly']));
  }

  getReportWithResponsePercentage() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'responsed', 'percentage']));
  }

  getMonthlyReportWithResponsePercentage() {
    return this.http.get<MonthlyStat[]>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'responsed', 'percentage', 'monthly']));
  }

  getReportWithWebsitePercentage() {
    return this.http.get<SimpleStat>(this.serviceUtils.getUrl(Api.Report, ['api', 'stats', 'reports', 'website', 'percentage']));
  }
}

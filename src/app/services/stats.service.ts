import { Injectable } from '@angular/core';
import { FetchService } from './helper/FetchService';
import { ApiSdkService } from './core/api-sdk.service';
import { CountByDate, SimpleStat } from '@betagouv/signalconso-api-sdk-js/lib/client/stats/Stats';

@Injectable({ providedIn: 'root' })
export class ReportCountService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getReportCount);
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportCountService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getMonthlyReportCount);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportForwardedToProPercentageService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getReportForwardedToProPercentage);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportReadByProPercentageService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getReportReadByProPercentage);
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportForwardedToProPercentageService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getMonthlyReportForwardedToProPercentage);
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportReadByProPercentageService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getMonthlyReportReadByProPercentage);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportWithResponsePercentageService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getReportWithResponsePercentage);
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportWithResponsePercentageService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getMonthlyReportWithResponsePercentage);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportWithWebsitePercentageService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getReportWithWebsitePercentage);
  }
}


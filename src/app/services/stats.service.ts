import { Injectable } from '@angular/core';
import { FetchService } from './helper/FetchService';
import { ApiSdkService } from './core/api-sdk.service';
import { CountByDate, ReportStatus, SimpleStat } from '@signal-conso/signalconso-api-sdk-js';

@Injectable({ providedIn: 'root' })
export class ReportCountService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getReportCount);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportAcceptedCountService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, () => api.unsecured.stats.getReportCount({status: [ReportStatus.PromesseAction]}));
  }
}

@Injectable({ providedIn: 'root' })
export class ReportForwardedToProPercentageService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.percentage.getReportForwardedToPro);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportReadByProPercentageService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.percentage.getReportReadByPro);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportWithResponsePercentageService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.percentage.getReportWithResponse);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportWithWebsitePercentageService extends FetchService<SimpleStat> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.percentage.getReportWithWebsite);
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportCountService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.getReportCountCurve);
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportPromesseDActionCountService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, () => api.unsecured.stats.getReportCountCurve({ status: [ReportStatus.PromesseAction] }));
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportForwardedToProPercentageService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.percentageCurve.getReportForwardedPercentage);
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportReadByProPercentageService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.percentageCurve.getReportReadPercentage);
  }
}

@Injectable({ providedIn: 'root' })
export class MonthlyReportWithResponsePercentageService extends FetchService<CountByDate[]> {
  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.stats.percentageCurve.getReportRespondedPercentage);
  }
}


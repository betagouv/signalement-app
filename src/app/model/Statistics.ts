import { JsonProperty } from 'json-typescript-mapper';

export class ReportsPerMonth {
  @JsonProperty('month')
  month: number;
  @JsonProperty('year')
  year: number;
  @JsonProperty('count')
  count: number;

  constructor() {
    this.month = undefined;
    this.year = undefined;
    this.count = undefined;
  }
}

export class ReportsByCategory {
  @JsonProperty('category')
  category: string;
  @JsonProperty('count')
  count: number;

  constructor() {
    this.category = undefined;
    this.count = undefined;
  }

}
export class ReportsByRegion {
  @JsonProperty('region')
  region: string;
  @JsonProperty('count')
  count: number;

  constructor() {
    this.region = undefined;
    this.count = undefined;
  }

}

export class Statistics {
  @JsonProperty('reportsCount')
  reportsCount: number;
  @JsonProperty({ name: 'reportsPerMonthList', clazz: ReportsPerMonth })
  reportsPerMonthList: ReportsPerMonth[];
  @JsonProperty('reportsCount7Days')
  reportsCount7Days: number;
  @JsonProperty('reportsCount7DaysInRegion')
  reportsCount7DaysInRegion: number;
  @JsonProperty('reportsCountInRegion')
  reportsCountInRegion: number;
  @JsonProperty('reportsCount30Days')
  reportsCount30Days: number;
  @JsonProperty('reportsCount30DaysInRegion')
  reportsCount30DaysInRegion: number;
  @JsonProperty('reportsPercentageSendedToPro')
  reportsPercentageSendedToPro: number;
  @JsonProperty('reportsPercentagePromise')
  reportsPercentagePromise: number;
  @JsonProperty('reportsPercentageWithoutSiret')
  reportsPercentageWithoutSiret: number;
  @JsonProperty('reportsDurationsForEnvoiSignalement')
  reportsDurationsForEnvoiSignalement: number;
  @JsonProperty('reportsCountByCategoryList')
  reportsCountByCategoryList: ReportsByCategory[];
  @JsonProperty('reportsCountByRegionList')
  reportsCountByRegionList: ReportsByRegion[];

  constructor() {
    this.reportsCount = undefined;
    this.reportsPerMonthList = undefined;
    this.reportsCount7Days = undefined;
    this.reportsCountInRegion = undefined;
    this.reportsCount7DaysInRegion = undefined;
    this.reportsCount30Days = undefined;
    this.reportsCount30DaysInRegion = undefined;
    this.reportsPercentageSendedToPro = undefined;
    this.reportsPercentagePromise = undefined;
    this.reportsPercentageWithoutSiret = undefined;
    this.reportsDurationsForEnvoiSignalement = undefined;
    this.reportsCountByCategoryList = undefined;
    this.reportsCountByRegionList = undefined;
  }
}

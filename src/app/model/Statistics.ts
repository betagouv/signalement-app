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
  @JsonProperty('reportsCountSendedToPro')
  reportsCountSendedToPro: number;
  @JsonProperty('reportsCountPromise')
  reportsCountPromise: number;
  @JsonProperty('reportsCountWithoutSiret')
  reportsCountWithoutSiret: number;
  @JsonProperty('reportsDurationsForEnvoiSignalement')
  reportsDurationsForEnvoiSignalement: number;

  constructor() {
    this.reportsCount = undefined;
    this.reportsPerMonthList = undefined;
    this.reportsCount7Days = undefined;
    this.reportsCountInRegion = undefined;
    this.reportsCount7DaysInRegion = undefined;
    this.reportsCount30Days = undefined;
    this.reportsCount30DaysInRegion = undefined;
    this.reportsCountSendedToPro = undefined;
    this.reportsCountPromise = undefined;
    this.reportsCountWithoutSiret = undefined;
    this.reportsDurationsForEnvoiSignalement = undefined;
  }
}

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

  constructor() {
    this.reportsCount = undefined;
    this.reportsPerMonthList = undefined;
  }
}

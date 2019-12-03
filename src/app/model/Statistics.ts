export class SimpleStat {
  value: number;
}

export class MonthlyStat {
  month: number;
  year: number;
  value: number;
}

export class ReportsByCategory {
  category: string;
  count: number;
}
export class ReportsByRegion {
  region: string;
  count: number;
}

export class Statistics {
  reportsPercentageSendedToPro: number;
  reportsDurationsForEnvoiSignalement: number;
}

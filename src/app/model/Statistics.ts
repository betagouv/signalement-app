export class ReportsPerMonth {
  month: number;
  year: number;
  count: number;
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
  reportsCount: number;
  reportsPerMonthList: ReportsPerMonth[];
  reportsCount7Days: number;
  reportsCount7DaysInRegion: number;
  reportsCountInRegion: number;
  reportsCount30Days: number;
  reportsCount30DaysInRegion: number;
  reportsPercentageSendedToPro: number;
  reportsPercentagePromise: number;
  reportsPercentageWithoutSiret: number;
  reportsDurationsForEnvoiSignalement: number;
  reportsCountByCategoryList: ReportsByCategory[];
  reportsCountByRegionList: ReportsByRegion[];
}

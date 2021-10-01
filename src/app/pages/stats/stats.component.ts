import { Component } from '@angular/core';
import {
  MonthlyReportCountService,
  MonthlyReportForwardedToProPercentageService,
  MonthlyReportReadByProPercentageService,
  MonthlyReportWithResponsePercentageService,
  ReportCountService,
  ReportForwardedToProPercentageService,
  ReportReadByProPercentageService,
  ReportWithResponsePercentageService,
  ReportWithWebsitePercentageService
} from '../../services/stats.service';
import { map } from 'rxjs/operators';
import { CountByDate, SimpleStat } from '@betagouv/signalconso-api-sdk-js/lib/client/stats/Stats';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
})
export class StatsComponent {

  constructor(
    public _reportCount: ReportCountService,
    public _monthlyReportCount: MonthlyReportCountService,
    public _reportForwardedToProPercentage: ReportForwardedToProPercentageService,
    public _reportReadByProPercentage: ReportReadByProPercentageService,
    public _monthlyReportForwardedToProPercentage: MonthlyReportForwardedToProPercentageService,
    public _monthlyReportReadByProPercentage: MonthlyReportReadByProPercentageService,
    public _reportWithResponsePercentage: ReportWithResponsePercentageService,
    public _monthlyReportWithResponsePercentage: MonthlyReportWithResponsePercentageService,
    public _reportWithWebsitePercentage: ReportWithWebsitePercentageService,
  ) {
  }

  static readonly getChartOption = (percentage = false) => (monthlyStats: CountByDate[]): EChartOption => {
    return {
      color: ['#407CA8'],
      xAxis: {
        type: 'category',
        data: StatsComponent.getXAxisData(),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => percentage ? `${value}%` : value
        }
      },
      series: [{
        data: StatsComponent.getStatsData(monthlyStats),
        type: 'bar',
        animationDuration: 5000,
        smooth: true
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      }
    };
  };

  static readonly getXAxisData = () => {
    const currentMonth = (new Date()).getMonth();
    const currentYear = (new Date()).getFullYear() - 2000;
    const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    return [
      ...months.slice(currentMonth + 1).map(label => `${label} ${currentYear - 1}`),
      ...months.slice(0, currentMonth + 1).map(label => `${label} ${currentYear}`)
    ];
  };

  static readonly getStatsData = (monthlyStats: CountByDate[]) => {
    const currentMonth = (new Date()).getMonth();
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthlyStats.forEach(monthlyStat => {
      data[monthlyStat.date.getMonth()] = monthlyStat.count;
    });
    return [...data.slice(currentMonth + 1), ...data.slice(0, currentMonth + 1)];
  };

  readonly mapPercentage = map((_: SimpleStat) => (+_.value).toFixed(0) + ' %');

  readonly mapValue = map((_: SimpleStat) => _.value);

  readonly mapToChart = (percentage = false) => map(StatsComponent.getChartOption(percentage));

}

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
  template: `
    <app-banner title="Statistiques"></app-banner>

    <app-page pageDefinitionKey="stats" size="small">
      <app-stats-item
        title="signalements ont été déposés depuis le début de SignalConso"
        [value$]="reportCount$"
        [chart$]="monthlyReportCount$"
      ></app-stats-item>

      <app-stats-item
        title="des signalements ont été transmis à l'entreprise signalée"
        desc="Pourquoi pas 100 % ? Car dans certaines cas (achat en ligne...) les entreprises n'ont pas pu être identifiées par le consommateur"
        [value$]="reportForwardedToProPercentage$"
        [chart$]="monthlyReportForwardedToProPercentage$"
      ></app-stats-item>

      <app-stats-item
        title="des signalements transmis ont été lus par les entreprises"
        desc="Pourquoi pas 100 % ? Car Signalconso est facultatif. L'entreprise est libre de créer un compte et de lire le signalement."
        [value$]="reportReadByProPercentage$"
        [chart$]="monthlyReportReadByProPercentage$"
      ></app-stats-item>

      <app-stats-item
        title="ont eu une réponse de l'entreprise, sur l'ensemble des signalements lus"
        desc="Lorsqu'une entreprise reçoit un signalement, elle peut décider de répondre ou non au consommateur."
        [value$]="reportWithResponsePercentage$"
        [chart$]="monthlyReportWithResponsePercentage$"
      ></app-stats-item>

      <app-stats-item
        title="des signalements déposés depuis le début de SignalConso concernent une entreprise sur internet"
        desc="Lorsqu'une entreprise reçoit un signalement, elle peut décider de répondre ou non au consommateur."
        [value$]="reportWithWebsitePercentage$"
      ></app-stats-item>

      <p class="note pt-2">
        Nos statistiques sont mises à jour en temps réel
      </p>
    </app-page>
  `,
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

  readonly mapValue = map((_: SimpleStat): string => '' + _.value);

  readonly mapToChart = (percentage = false) => map(StatsComponent.getChartOption(percentage));

  readonly reportCount$ = this._reportCount.list().pipe(this.mapValue);
  readonly monthlyReportCount$ = this._monthlyReportCount.list().pipe(this.mapToChart(false));
  readonly reportForwardedToProPercentage$ = this._reportForwardedToProPercentage.list().pipe(this.mapPercentage);
  readonly monthlyReportForwardedToProPercentage$ = this._monthlyReportForwardedToProPercentage.list().pipe(this.mapToChart(true));
  readonly reportReadByProPercentage$ = this._reportReadByProPercentage.list().pipe(this.mapPercentage);
  readonly monthlyReportReadByProPercentage$ = this._monthlyReportReadByProPercentage.list().pipe(this.mapToChart(true));
  readonly reportWithResponsePercentage$ = this._reportWithResponsePercentage.list().pipe(this.mapPercentage);
  readonly monthlyReportWithResponsePercentage$ = this._monthlyReportWithResponsePercentage.list().pipe(this.mapToChart(true));
  readonly reportWithWebsitePercentage$ = this._reportWithWebsitePercentage.list().pipe(this.mapPercentage);
}

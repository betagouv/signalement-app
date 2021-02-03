import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { EChartOption } from 'echarts';
import { MonthlyStat } from '../../model/Statistics';
import { Roles } from '../../model/AuthUser';
import pages from '../../../assets/data/pages.json';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { parse } from 'iso8601-duration';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  roles = Roles;

  reportCount: number;
  reportForwardedToProPercentage: number;
  reportReadByProPercentage: number;
  reportReadByProMedianDelay: number;
  reportWithResponsePercentage: number;
  reportWithResponseMedianDelay: number;
  reportWithWebsitePercentage: number;

  monthlyReportChart: EChartOption;
  monthlyReportForwardedToProChart: EChartOption;
  monthlyReportReadByProChart: EChartOption;
  monthlyReportWithResponseChart: EChartOption;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private statsService: StatsService,
              private authenticationService: AuthenticationService,
              private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.stats.title);
    this.meta.updateTag({ name: 'description', content: pages.stats.description });

    this.authenticationService.user
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        if (user && user.role === this.roles.Admin) {
          this.loadAminStatistics();
        }
      });

    this.loadStatistics();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  renderCharts() {
    return isPlatformBrowser(this.platformId);
  }

  loadStatistics() {
    this.statsService.getReportCount().subscribe(simpleStat => {
      this.reportCount = simpleStat.value as number;
    });

    this.statsService.getReportForwardedToProPercentage().subscribe(simpleStat => {
      this.reportForwardedToProPercentage = simpleStat.value as number;
    });

    this.statsService.getReportReadByProPercentage().subscribe(simpleStat => {
      this.reportReadByProPercentage = simpleStat.value as number;
    });

    this.statsService.getReportWithResponsePercentage().subscribe(simpleStat => {
      this.reportWithResponsePercentage = simpleStat.value as number;
    });

    this.statsService.getReportWithWebsitePercentage().subscribe(simpleStat => {
      this.reportWithWebsitePercentage = simpleStat.value as number;
    });
  }

  loadAminStatistics() {

    this.statsService.getReportReadByProMedianDelay().subscribe(simpleStat => {
      this.reportReadByProMedianDelay = parse(simpleStat.value as string).hours / 24;
    });

    this.statsService.getReportWithResponseMedianDelay().subscribe(simpleStat => {
      this.reportWithResponseMedianDelay = parse(simpleStat.value as string).hours / 24;
    });
  }


  loadMonthlyReportChart() {
    this.statsService.getMonthlyReportCount().subscribe(monthlyStats => {
      this.monthlyReportChart = this.getChartOption(monthlyStats);
    });
  }

  loadMonthlyReportForwardedToProChart() {
    this.statsService.getMonthlyReportForwardedToProPercentage().subscribe(monthlyStats => {
      this.monthlyReportForwardedToProChart = this.getChartOption(monthlyStats, true);
    });
  }

  loadMonthlyReportReadByProChart() {
    this.statsService.getMonthlyReportReadByProPercentage().subscribe(monthlyStats => {
      this.monthlyReportReadByProChart = this.getChartOption(monthlyStats, true);
    });
  }

  loadMonthlyReportWithReponseChart() {
    this.statsService.getMonthlyReportWithResponsePercentage().subscribe(monthlyStats => {
      this.monthlyReportWithResponseChart = this.getChartOption(monthlyStats, true);
    });
  }

  getChartOption(monthlyStats: MonthlyStat[], percentage = false): EChartOption {
    return {
      color: ['#407CA8'],
      xAxis: {
        type: 'category',
        data: this.getXAxisData(),
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
        data: this.getStatsData(monthlyStats),
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
  }

  getXAxisData() {
    const currentMonth = (new Date()).getMonth();
    const currentYear = (new Date()).getFullYear() - 2000;
    const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    return [
      ...months.slice(currentMonth + 1).map(label => `${label} ${currentYear - 1}`),
      ...months.slice(0, currentMonth + 1).map(label => `${label} ${currentYear}`)
    ];
  }

  getStatsData(monthlyStats: MonthlyStat[]) {
    const currentMonth = (new Date()).getMonth();
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthlyStats.forEach(monthlyStat => {
      data[monthlyStat.month] = monthlyStat.value;
    });
    return [...data.slice(currentMonth + 1), ...data.slice(0, currentMonth + 1)];
  }
}

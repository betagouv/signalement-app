import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { EChartOption } from 'echarts';
import { MonthlyStat } from '../../model/Statistics';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/AuthUser';
import pages from '../../../assets/data/pages.json';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  reportCount: number;
  reportReadByProPercentage: number;
  reportReadByProMedianDelay: number;
  reportWithResponsePercentage: number;
  reportWithResponseMedianDelay: number;

  monthlyReportChart: EChartOption;
  monthlyReportReadByProChart: EChartOption;
  monthlyReportWithResponseChart: EChartOption;

  user: User;

  constructor(private statsService: StatsService,
              private authenticationService: AuthenticationService,
              private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle(pages.stats.title);

    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });

    this.loadStatistics();
  }

  loadStatistics() {
    this.statsService.getReportCount().subscribe(simpleStat => {
      this.reportCount = simpleStat.value;
    });

    this.statsService.getReportReadByProPercentage().subscribe(simpleStat => {
      this.reportReadByProPercentage = simpleStat.value;
    });

    this.statsService.getReportReadByProMedianDelay().subscribe(simpleStat => {
      this.reportReadByProMedianDelay = moment.duration(simpleStat.value).asDays();
    });

    this.statsService.getReportWithResponsePercentage().subscribe(simpleStat => {
      this.reportWithResponsePercentage = simpleStat.value;
    });

    this.statsService.getReportWithResponseMedianDelay().subscribe(simpleStat => {
      this.reportWithResponseMedianDelay = moment.duration(simpleStat.value).asDays();
    });
  }


  loadMonthlyReportChart() {
    this.statsService.getMonthlyReportCount().subscribe(monthlyStats => {
      this.monthlyReportChart = this.getChartOption(monthlyStats);
    });
  }

  loadMonthlyReportReadByProChart() {
    this.statsService.getMonthlyReportReadByProPercentage().subscribe(monthlyStats => {
      this.monthlyReportReadByProChart = this.getChartOption(monthlyStats);
    });
  }

  loadMonthlyReportWithReponseChart() {
    this.statsService.getMonthlyReportWithResponsePercentage().subscribe(monthlyStats => {
      this.monthlyReportWithResponseChart = this.getChartOption(monthlyStats);
    });
  }

  getChartOption(monthlyStats: MonthlyStat[]): EChartOption {
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
        type: 'value'
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

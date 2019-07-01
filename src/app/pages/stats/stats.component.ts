import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { EChartOption } from 'echarts';
import { Statistics } from '../../model/Statistics';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  statistics: Statistics;

  chartOption: EChartOption;
  loading: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private statsService: StatsService) { }

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.loading = true;
    this.statsService.getStatistics().subscribe(stats => {
      this.loading = false;
      this.statistics = stats;

      this.chartOption = {
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
          data: this.getSeriesData(),
          type: 'line',
          animationDuration: 5000,
          smooth: true
        }],
        title: {
          text: 'Nombre de signalements / mois',
          left: 'center',
          top: '20',
          textStyle: {
            color: '#53657d',
            fontSize: 18
          }
        }
      };
    });
  }

  getXAxisData() {
    const currentMonth = (new Date()).getMonth();
    const currentYear = (new Date()).getFullYear() - 2000;
    const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    return [
      ...months.slice(currentMonth).map(label => `${label} ${currentYear - 1}`),
      ...months.slice(0, currentMonth).map(label => `${label} ${currentYear}`)
    ];
  }

  getSeriesData() {
    const currentMonth = (new Date()).getMonth();
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.statistics.reportsPerMonthList.forEach(reportsPerMonth => {
      data[reportsPerMonth.month] = reportsPerMonth.count;
    });
    return [...data.slice(currentMonth + 1), ...data.slice(0, currentMonth + 1)];
  }

  isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}

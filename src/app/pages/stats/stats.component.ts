import { Component, Inject, OnInit, PLATFORM_ID, HostListener } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { EChartOption } from 'echarts';
import { Statistics } from '../../model/Statistics';
import { isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/AuthUser';
import pages from '../../../assets/data/pages.json';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  statistics: Statistics;

  byMonthsChartOption: EChartOption;
  byCategoriesChartOption: EChartOption;
  byRegionsChartOption: EChartOption;
  loading: boolean;

  user: User;
  innerWidth: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private statsService: StatsService,
              private authenticationService: AuthenticationService,
              private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle(pages.stats.title);

    this.loadStatistics();

    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });
    this.innerWidth = window.innerWidth;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.setOptionnalLegend();
  }

  setOptionnalLegend() {
    if (this.innerWidth < 850) {
      this.byCategoriesChartOption = {...this.byCategoriesChartOption, legend: { ...this.byCategoriesChartOption.legend, show: false }};
    } else {
      this.byCategoriesChartOption = {...this.byCategoriesChartOption, legend: { ...this.byCategoriesChartOption.legend, show: true }};
    }
  }

  loadStatistics() {
    this.loading = true;
    this.statsService.getStatistics().subscribe(stats => {

      this.loading = false;
      this.statistics = stats;

      this.byMonthsChartOption = {
        color: ['#0053b3'],
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
          type: 'bar',
          animationDuration: 5000,
          smooth: true
        }],
        title: {
          text: 'Nombre de signalements par mois',
          left: 'center',
          top: '20',
          textStyle: {
            color: '#53657d',
            fontSize: 18
          }
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {
              type : 'shadow'
          }
        },

      };

      this.byCategoriesChartOption = {
        title : {
          text: 'Signalements par catégorie',
          left: 'center',
          textStyle: {
            color: '#003b80',
            fontSize: 18
          }

        },
        tooltip : {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 25,
            data: this.statistics.reportsCountByCategoryList.map(s => s.category)
        },
        series : [
            {
                name: 'Catégorie',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['50%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data: this.statistics.reportsCountByCategoryList.map(s => ({name: s.category, value: s.count})),
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]

      };

      this.setOptionnalLegend();

      const dataRegion = this.statistics.reportsCountByRegionList.map(s => s.count);
      const nbHorsRegion = this.statistics.reportsCount - dataRegion.reduce((acc, curr) => acc + curr, 0);

      this.byRegionsChartOption = {
        color: ['#0053b3'],
        xAxis: {
          type: 'category',
          data: [...this.statistics.reportsCountByRegionList.map(s => s.region), 'Autre'],
          axisLabel: {
            rotate: 0
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [...this.statistics.reportsCountByRegionList.map(s => s.count), nbHorsRegion],
          type: 'bar',
          animationDuration: 5000,
          smooth: true
        }],
        title: {
          text: 'Nombre de signalements par région',
          left: 'center',
          top: '20',
          textStyle: {
            color: '#003b80',
            fontSize: 18
          }
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {
              type : 'shadow'
          }
        },

      };

    });
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsComponent } from './stats.component';
import { StatsService } from '../../services/stats.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { MonthlyStat, SimpleStat } from '../../model/Statistics';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoleDirective } from '../../directives/app-role/app-role.directive';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/AuthUser';
import { ComponentsModule } from '../../components/components.module';
import * as echarts from 'echarts';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;
  let statsService: StatsService;
  let authenticationService: AuthenticationService;

  const reportCount = Object.assign(new SimpleStat(), { value: 53 });
  const reportReadByProPercentage = Object.assign(new SimpleStat(), { value: 12.5 });
  const reportForwardedToProPercentage = Object.assign(new SimpleStat(), { value: 56.89 });
  const reportWithResponseCount = Object.assign(new SimpleStat(), { value: 43.89 });
  const reportWithWebsiteCount = Object.assign(new SimpleStat(), { value: 53.09 });
  const reportReadByProMedianDelay = Object.assign(new SimpleStat(), { value: 'PT25H11M18.691S'});
  const reportWithResponseMedianDelay = Object.assign(new SimpleStat(), { value: 'PT140H12M35.691S'});

  const monthlyStat1 = Object.assign(new MonthlyStat(), { month: 1, year: 2018, value: 5 });
  const monthlyStat2 = Object.assign(new MonthlyStat(), { month: 2, year: 2018, value: 8 });
  const monthyReportCount = [monthlyStat1, monthlyStat2];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StatsComponent,
        AppRoleDirective
      ],
      imports: [
        HttpClientModule,
        NgxEchartsModule.forRoot({ echarts }),
        NgxLoadingModule,
        ComponentsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    statsService = TestBed.inject(StatsService);
    spyOn(statsService, 'getReportCount').and.returnValue(of(reportCount));
    spyOn(statsService, 'getReportReadByProPercentage').and.returnValue(of(reportReadByProPercentage));
    spyOn(statsService, 'getReportForwardedToProPercentage').and.returnValue(of(reportForwardedToProPercentage));
    spyOn(statsService, 'getReportWithResponsePercentage').and.returnValue(of(reportWithResponseCount));
    spyOn(statsService, 'getReportWithWebsitePercentage').and.returnValue(of(reportWithWebsiteCount));
    spyOn(statsService, 'getMonthlyReportCount').and.returnValue(of(monthyReportCount));
    spyOn(statsService, 'getReportReadByProMedianDelay').and.returnValue(of(reportReadByProMedianDelay));
    spyOn(statsService, 'getReportWithResponseMedianDelay').and.returnValue(of(reportWithResponseMedianDelay));
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {

    it('should load the public global stats', () => {

      component.ngOnInit();

      expect(component.reportCount).toEqual(53);
      expect(component.reportReadByProPercentage).toEqual(12.5);
      expect(component.reportForwardedToProPercentage).toEqual(56.89);
      expect(component.reportWithResponsePercentage).toEqual(43.89);
      expect(component.reportWithWebsitePercentage).toEqual(53.09);
      expect(component.reportWithResponseMedianDelay).toBeUndefined();
      expect(component.reportReadByProMedianDelay).toBeUndefined();
    });

    it ('should set the last 12 months on the xAxis when current month is April', () => {
      const baseTime = new Date(2018, 3, 8);
      jasmine.clock().mockDate(baseTime);

      component.loadMonthlyReportChart();

      expect(component.monthlyReportChart.xAxis['data']).toEqual(
        [
          'mai 17', 'juin 17', 'juil. 17', 'août 17', 'sept. 17', 'oct. 17',
          'nov. 17', 'déc. 17', 'jan. 18', 'fév. 18', 'mars 18', 'avr. 18'
        ]
      );

    });

    it ('should set the last 12 months on the xAxis when current month is January', () => {
      const baseTime = new Date(2018, 0, 8);
      jasmine.clock().mockDate(baseTime);

      component.loadMonthlyReportChart();

      expect(component.monthlyReportChart.xAxis['data']).toEqual(
        [
          'fév. 17', 'mars 17', 'avr. 17', 'mai 17', 'juin 17', 'juil. 17',
          'août 17', 'sept. 17', 'oct. 17', 'nov. 17', 'déc. 17', 'jan. 18'
        ]
      );

    });

    it ('should set the last 12 months on the xAxis when current month is December', () => {
      const baseTime = new Date(2018, 11, 8);
      jasmine.clock().mockDate(baseTime);

      component.loadMonthlyReportChart();

      expect(component.monthlyReportChart.xAxis['data']).toEqual(
        [
          'jan. 18', 'fév. 18', 'mars 18', 'avr. 18', 'mai 18', 'juin 18',
          'juil. 18', 'août 18', 'sept. 18', 'oct. 18', 'nov. 18', 'déc. 18'
        ]
      );

    });

    it('should set data from stats when current month is April', () => {
      const baseTime = new Date(2018, 3, 8);
      jasmine.clock().mockDate(baseTime);

      component.loadMonthlyReportChart();

      expect(component.monthlyReportChart.series[0]['data']).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 8, 0]);
    });

  });

  describe('for a professional user', () => {

    beforeEach(() => {
      authenticationService = TestBed.inject(AuthenticationService);
      authenticationService.user = of(Object.assign(new User(), { role: 'Admin' }));
    });

    it('on init it should load the public and admins global stats', () => {

      component.ngOnInit();

      expect(component.reportCount).toEqual(53);
      expect(component.reportReadByProPercentage).toEqual(12.5);
      expect(component.reportWithResponsePercentage).toEqual(43.89);
      expect(component.reportWithResponseMedianDelay).toEqual(5.833333333333333);
      expect(component.reportReadByProMedianDelay).toEqual(1.0416666666666667);
    });

  });
});

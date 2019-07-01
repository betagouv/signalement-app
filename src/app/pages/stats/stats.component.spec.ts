import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsComponent } from './stats.component';
import { StatsService } from '../../services/stats.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { deserialize } from 'json-typescript-mapper';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReportsPerMonth } from '../../model/Statistics';
import { NgxLoadingModule } from 'ngx-loading';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;
  let statsService: StatsService;

  const reportsPerMonth1 = deserialize(ReportsPerMonth, { month: 1, year: 2018, count: 5 });
  const reportsPerMonth2 = deserialize(ReportsPerMonth, { month: 2, year: 2018, count: 8 });

  const statisticsFixture = {
    reportsCount: 53,
    reportsPerMonthList: [
      reportsPerMonth1,
      reportsPerMonth2
    ],
    "reportsCount7Days": 8,
    "reportsCount30Days": 9,
    "reportsCountInRegion": 9,
    "reportsCount7DaysInRegion": 2,
    "reportsCount30DaysInRegion": 3,
    "reportsCountSendedToPro": 4,
    "reportsCountPromise": 2,
    "reportsCountWithoutSiret": 3,
    "reportsCountByCategoryList": [
        {
            "category": "Nourriture et boissons",
            "count": 4
        },
        {
            "category": "Pratique d'hygiène",
            "count": 49
        },
        {
            "category": "Prix / Paiement",
            "count": 4
        },
        {
            "category": "Publicité",
            "count": 1
        },
        {
            "category": "Services après-vente",
            "count": 3
        }
    ],
    "reportsCountByRegionList": [
        {
            "region": "AURA",
            "count": 1
        },
        {
            "region": "CDVL",
            "count": 6
        },
        {
            "region": "OCC",
            "count": 2
        }
    ],
    "reportsDurationsForEnvoiSignalement": 4

  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsComponent ],
      imports: [
        HttpClientModule,
        NgxEchartsModule,
        NgxLoadingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    statsService = TestBed.get(StatsService);
    spyOn(statsService, 'getStatistics').and.returnValue(of(statisticsFixture));
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {

    it('should load the stats', () => {

      component.ngOnInit();

      expect(component.statistics.reportsCount).toEqual(53);
      expect(component.statistics.reportsPerMonthList.length).toEqual(2);
      expect(component.statistics.reportsPerMonthList).toContain(reportsPerMonth1);
      expect(component.statistics.reportsPerMonthList).toContain(reportsPerMonth2);
    });

    it ('should set the last 12 months on the xAxis when current month is April', () => {
      const baseTime = new Date(2018, 3, 8);
      jasmine.clock().mockDate(baseTime);

      const data = component.ngOnInit();

      expect(component.chartOption.xAxis['data']).toEqual(
        [
          'avr. 17', 'mai 17', 'juin 17', 'juil. 17', 'août 17', 'sept. 17',
          'oct. 17', 'nov. 17', 'déc. 17', 'jan. 18', 'fév. 18', 'mars 18'
        ]
      );

    });

    it ('should set the last 12 months on the xAxis when current month is January', () => {
      const baseTime = new Date(2018, 0, 8);
      jasmine.clock().mockDate(baseTime);

      component.ngOnInit();

      expect(component.chartOption.xAxis['data']).toEqual(
        [
          'jan. 17', 'fév. 17', 'mars 17', 'avr. 17', 'mai 17', 'juin 17',
          'juil. 17', 'août 17', 'sept. 17', 'oct. 17', 'nov. 17', 'déc. 17'
        ]
      );

    });

    it ('should set the last 12 months on the xAxis when current month is December', () => {
      const baseTime = new Date(2018, 11, 8);
      jasmine.clock().mockDate(baseTime);

      component.ngOnInit();

      expect(component.chartOption.xAxis['data']).toEqual(
        [
          'déc. 17', 'jan. 18', 'fév. 18', 'mars 18', 'avr. 18', 'mai 18',
          'juin 18', 'juil. 18', 'août 18', 'sept. 18', 'oct. 18', 'nov. 18'
        ]
      );

    });

    it('should set data from stats when current month is April', () => {
      const baseTime = new Date(2018, 3, 8);
      jasmine.clock().mockDate(baseTime);

      component.statistics = statisticsFixture;

      component.ngOnInit();

      expect(component.chartOption.series[0]['data']).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 8, 0]);
    });

  });
});

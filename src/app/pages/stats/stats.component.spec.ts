import { StatsComponent } from './stats.component';
import { CountByDate } from '@signal-conso/signalconso-api-sdk-js/lib/client/stats/Stats';

describe('StatsComponent', () => {

  const monthlyStat1: CountByDate = { date: new Date('2018-01-01'), count: 5 };
  const monthlyStat2: CountByDate = { date: new Date('2018-02-01'), count: 8 };
  const monthyReportCount = [monthlyStat1, monthlyStat2];

  it('should set the last 12 months on the xAxis when current month is April', () => {
    const baseTime = new Date(2018, 3, 8);
    jasmine.clock().mockDate(baseTime);
    const chart = StatsComponent.getChartOption(false)(monthyReportCount);
    expect(chart.xAxis['data']).toEqual([
      'mai 17', 'juin 17', 'juil. 17', 'août 17', 'sept. 17', 'oct. 17',
      'nov. 17', 'déc. 17', 'jan. 18', 'fév. 18', 'mars 18', 'avr. 18'
    ]);
  });

  it('should set the last 12 months on the xAxis when current month is January', () => {
    const baseTime = new Date(2018, 0, 8);
    jasmine.clock().mockDate(baseTime);
    const chart = StatsComponent.getChartOption(false)(monthyReportCount);

    expect(chart.xAxis['data']).toEqual([
      'fév. 17', 'mars 17', 'avr. 17', 'mai 17', 'juin 17', 'juil. 17',
      'août 17', 'sept. 17', 'oct. 17', 'nov. 17', 'déc. 17', 'jan. 18'
    ]);
  });

  it('should set the last 12 months on the xAxis when current month is December', async () => {
    const baseTime = new Date(2018, 11, 8);
    jasmine.clock().mockDate(baseTime);
    const chart = StatsComponent.getChartOption(false)(monthyReportCount);
    expect(chart.xAxis['data']).toEqual([
      'jan. 18', 'fév. 18', 'mars 18', 'avr. 18', 'mai 18', 'juin 18',
      'juil. 18', 'août 18', 'sept. 18', 'oct. 18', 'nov. 18', 'déc. 18'
    ]);
  });

  it('should set data from stats when current month is April', async () => {
    const baseTime = new Date(2018, 3, 8);
    jasmine.clock().mockDate(baseTime);
    const chart = StatsComponent.getChartOption(false)(monthyReportCount);
    expect(chart.series[0]['data']).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 5, 8, 0, 0]);
  });
});

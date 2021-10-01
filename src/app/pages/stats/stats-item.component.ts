import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { EChartOption } from 'echarts';
import { mergeMap, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

interface ObsHandler<T> {
  value?: T;
  loading?: boolean;
  load: () => void;
}

@Component({
  selector: 'app-stats-item',
  template: `
    <app-panel [loading]="value.loading || chart.loading">
      <app-panel-body>
        <h2 *ngIf="value">
          <span class="count">{{value.value}}</span>
          <div>{{title}}</div>
          <div>{{desc}}</div>
        </h2>
        <button mat-button color="primary" (click)="chart.load()">
          Consulter les statistiques mensuelles
        </button>

        <div echarts [options]="chart.value" *ngIf="chart.value"></div>
      </app-panel-body>
    </app-panel>
  `,
  styleUrls: ['./stats-item.component.scss']
})
export class StatsItemComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.value = StatsItemComponent.handleObservable(() => this.value$);
    this.chart = StatsItemComponent.handleObservable(() => this.chart$);
  }

  @Input() title: string;

  @Input() desc?: string;

  @Input() value$: Observable<string>;

  @Input() chart$: Observable<EChartOption[]>;

  value: ObsHandler<string>;

  chart: ObsHandler<EChartOption[]>;

  static readonly handleObservable = <T>(obs: () => Observable<T>): ObsHandler<T> => {
    let loading = false;
    let value: T | undefined;
    const mappedObs = new Observable(_ => _.next()).pipe(
      tap(_ => {
        loading = true;
      }),
      mergeMap(obs),
      tap(_ => {
        value = _;
        loading = false;
      })
    );
    return {
      loading,
      value,
      load: () => mappedObs.subscribe()
    };
  };

  ngOnInit() {
    this.value.load();
  }

  readonly renderCharts = () => isPlatformBrowser(this.platformId);
}

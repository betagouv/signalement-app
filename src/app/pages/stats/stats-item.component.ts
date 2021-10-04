import { ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
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
    <app-panel [loading]="(chart$ && !(chart$ | async)) || (value$ && !(value$ | async))">
      <app-panel-body>
        <div>
          <span class="count">{{value$ | async}}</span>
          <div class="title">{{title}}</div>
          <div class="desc">{{desc}}</div>
        </div>
        <ng-container *ngIf="chart$ | async as chart">
          <div echarts [options]="chart"></div>
        </ng-container>
      </app-panel-body>
    </app-panel>
  `,
  styleUrls: ['./stats-item.component.scss']
})
export class StatsItemComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public cdr: ChangeDetectorRef
  ) {
    // this.value = this.handleObservable(() => this.value$);
    // this.chart = this.handleObservable(() => this.chart$);
  }

  @Input() title: string;

  @Input() desc?: string;

  @Input() value$: Observable<string>;

  @Input() chart$: Observable<EChartOption[]>;

  // value: ObsHandler<string>;
  //
  // chart: ObsHandler<EChartOption[]>;

  readonly handleObservable = <T>(obs: () => Observable<T>): ObsHandler<T> => {
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
        this.cdr.detectChanges();
      })
    );
    return {
      loading,
      value,
      load: () => mappedObs.subscribe()
    };
  };

  ngOnInit() {
  //   this.value.load();
  }

  readonly renderCharts = () => isPlatformBrowser(this.platformId);
}

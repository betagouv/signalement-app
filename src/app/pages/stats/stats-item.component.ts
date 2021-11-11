import { ChangeDetectionStrategy, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { EChartOption } from 'echarts';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stats-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class StatsItemComponent {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  @Input() title: string;

  @Input() desc?: string;

  @Input() value$: Observable<string>;

  @Input() chart$: Observable<EChartOption[]>;

  readonly renderCharts = () => isPlatformBrowser(this.platformId);
}

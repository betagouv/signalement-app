import {Component} from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <mat-progress-spinner
      mode="indeterminate"
      strokeWidth="2"
      [diameter]="size"
      [style.height.px]="size"
      [style.width.px]="size">
    </mat-progress-spinner>
  `,
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  readonly size = 24;
}

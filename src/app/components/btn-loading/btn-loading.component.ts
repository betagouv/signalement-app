import {Component} from '@angular/core';

@Component({
  selector: 'app-btn-loading',
  template: `
    <mat-progress-spinner
      mode="indeterminate"
      strokeWidth="2"
      [diameter]="size"
      [style.height.px]="size"
      [style.width.px]="size">
    </mat-progress-spinner>
  `,
  styleUrls: ['./btn-loading.component.scss']
})
export class BtnLoadingComponent {
  readonly size = 24;
}

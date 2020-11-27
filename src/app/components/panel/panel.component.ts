import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panel',
  styleUrls: ['./panel.component.scss'],
  template: `
    <mat-progress-bar *ngIf="loading" mode="indeterminate" class="app-panel-progress"></mat-progress-bar>
    <ng-content></ng-content>
  `
})
export class PanelComponent {

  @Input() loading: boolean;
}

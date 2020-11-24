import { Component } from '@angular/core';

@Component({
  selector: 'app-panel-header',
  styleUrls: ['./panel-header.component.scss'],
  template: `
    <ng-content></ng-content>
  `
})
export class PanelHeaderComponent {
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-panel-body',
  styleUrls: ['./panel-body.component.scss'],
  template: `
    <ng-content></ng-content>
  `
})
export class PanelBodyComponent {
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-panel-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./panel-body.component.scss'],
  template: `
    <ng-content></ng-content>
  `,
})
export class PanelBodyComponent {
}

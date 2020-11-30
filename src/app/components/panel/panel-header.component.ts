import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-panel-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./panel-header.component.scss'],
  template: `
    <ng-content></ng-content>
  `,
})
export class PanelHeaderComponent {
}

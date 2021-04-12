import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-panel-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./panel-actions.component.scss'],
  template: `
    <ng-content></ng-content>
  `,
})
export class PanelActionsComponent {
}

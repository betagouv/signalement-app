import { Component, Input } from '@angular/core';

export type BadgeType = 'error' | 'warning' | 'success' | 'info' | 'default';

@Component({
  selector: 'app-badge',
  styleUrls: ['./badge.component.scss'],
  host: {
    '[class]': '"-" + type',
  },
  template: `
    <ng-content></ng-content>
  `
})
export class BadgeComponent {

  @Input() type: BadgeType = 'default';
}

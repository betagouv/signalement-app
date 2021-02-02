import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-list-item',
  template: `
    <div class="root">
      <mat-icon *ngIf="icon">{{icon}}</mat-icon>
      {{label}}
    </div>
    <ng-content></ng-content>
  `,
  styleUrls: ['./subscription-list-item.component.scss']
})
export class SubscriptionListItemComponent {

  @Input() icon?: string;

  @Input() label?: string;
}

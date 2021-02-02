import { Component, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-subscription-card-row',
  template: `
    <div class="-root" [ngClass]="hoverable ? '-hoverable': ''">
      <mat-icon class="-icon">{{icon}}</mat-icon>
      <div class="-label">{{label}}</div>
      <div class="-content">
        <ng-content></ng-content>
      </div>
      <mat-icon class="-edit">navigate_next</mat-icon>
    </div>
    <div class="-border"></div>
  `,
  styleUrls: ['./subscription-card-row.component.scss']
})
export class SubscriptionCardRowComponent {

  @Input() icon?: string;

  @Input() label?: string;

  private _hoverable: boolean;
  @Input()
  get hoverable() {
    return this._hoverable;
  }

  set hoverable(value: any) {
    this._hoverable = coerceBooleanProperty(value);
  }
}

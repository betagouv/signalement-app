import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type BtnState = 'loading' | 'error' | 'success';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[app-btn]',
  host: {
    '[class]': '"-" + state',
    '[attr.disabled]': 'disabled || null',
    '[class.mat-button-disabled]': 'disabled',
    'class': 'mat-stroked-button mat-button-base'
  },
  template: `
    <ng-container [ngSwitch]="state">
      <mat-progress-spinner
        *ngSwitchCase="'loading'"
        mode="indeterminate"
        strokeWidth="4"
        [diameter]="size"
        [style.height.px]="size"
        [style.width.px]="size">
      </mat-progress-spinner>
      <mat-icon *ngSwitchCase="'error'">{{iconError || 'error'}}</mat-icon>
      <mat-icon *ngSwitchCase="'success'">{{iconSuccess || 'check_circle'}}</mat-icon>
      <ng-container *ngSwitchDefault>
        <mat-icon *ngIf="icon" class="app-btn-icon">{{icon}}</mat-icon>
      </ng-container>
    </ng-container>
    &nbsp;
    <ng-content></ng-content>
    <span matRipple class="mat-button-ripple" [matRippleTrigger]="elementRef.nativeElement"></span>
    <span class="mat-button-focus-overlay"></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./btn.component.scss']
})
export class BtnComponent {

  constructor(public elementRef: ElementRef) {
  }

  readonly size = 24;

  @Input() icon: string;

  @Input() iconError?: string;

  @Input() iconSuccess?: string;

  @Input() state?: BtnState;

  private _disabled = false;

  get disabled() {
    return this._disabled;
  }

  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }
}

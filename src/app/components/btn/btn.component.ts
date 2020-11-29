import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type BtnState = 'loading' | 'error' | 'success' | 'default';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[app-btn]',
  host: {
    '[class]': '"-" + state',
    '[attr.disabled]': 'disabled || null',
    '[class.-dense]': 'dense',
    '[class.mat-button-disabled]': 'disabled',
    'class': 'mat-stroked-button mat-button-base'
  },
  template: `
    <ng-container [ngSwitch]="state">
      <mat-progress-spinner
        *ngSwitchCase="'loading'"
        mode="indeterminate"
        strokeWidth="3"
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
    <div class="app-btn-content">
      <ng-content></ng-content>
    </div>
    <mat-icon *ngIf="showDeleteBtn" class="app-btn-icon">{{iconDelete || 'delete'}}</mat-icon>
    <span matRipple class="mat-button-ripple" [matRippleTrigger]="elementRef.nativeElement"></span>
    <span class="mat-button-focus-overlay"></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./btn.component.scss',]
})
export class BtnComponent implements OnInit {

  constructor(public elementRef: ElementRef) {
  }

  get size() {
    return this.dense ? 20 : 24;
  }

  @Input() icon?: string;

  @Input() iconDelete?: string;

  @Input() iconError?: string;

  @Input() iconSuccess?: string;

  @Input() state?: BtnState;

  @Output() deleted = new EventEmitter<void>();

  private _disabled = false;
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _dense = false;
  @Input()
  get dense() {
    return this._dense;
  }

  set dense(value: any) {
    this._dense = coerceBooleanProperty(value);
  }

  showDeleteBtn = false;

  ngOnInit() {
    this.showDeleteBtn = this.deleted.observers.length > 0;
  }
}

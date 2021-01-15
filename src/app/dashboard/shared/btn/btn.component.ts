import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type BtnState = 'loading' | 'error' | 'success' | 'default';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'button[app-btn], a[app-btn]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./btn.component.scss',],
  host: {
    '[class]': '"-" + getState()',
    '[attr.disabled]': 'disabled || null',
    '[class.-dense]': 'dense',
    '[class.mat-button-disabled]': 'disabled',
    'class': 'mat-stroked-button mat-button-base'
  },
  template: `
    <ng-container [ngSwitch]="getState()">
      <mat-progress-spinner
        *ngSwitchCase="'loading'"
        mode="indeterminate"
        strokeWidth="3"
        [diameter]="spinnerSize"
        [style.height.px]="spinnerSize"
        [style.width.px]="spinnerSize">
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
  `
})
export class BtnComponent implements OnInit {

  constructor(public elementRef: ElementRef) {
  }

  get spinnerSize() {
    return this.dense ? 20 : 24;
  }

  @Input() error?: boolean;

  @Input() success?: boolean;

  @Input() loading: boolean;

  @Input() icon?: string;

  @Input() iconDelete?: string;

  @Input() iconError?: string;

  @Input() iconSuccess?: string;

  getState = (): BtnState => {
    if (this.loading) {
      return 'loading';
    }
    if (this.error) {
      return 'error';
    }
    if (this.success) {
      return 'success';
    }
    return 'default';
  };

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

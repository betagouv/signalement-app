import { Component, Directive, HostBinding, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { slideToggle } from '../../../utils/animations';

export type AlertType = 'error' | 'info' | 'success' | 'warning';

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'app-alert-action' })
// tslint:disable-next-line:directive-class-suffix
export class AlertActionComponent {
}

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[app-alert-close]' })
// tslint:disable-next-line:directive-class-suffix
export class AlertCloseComponent {
}

@Component({
  selector: 'app-alert',
  host: {
    '[class]': '"-" + type',
  },
  styleUrls: ['./alert.component.scss'],
  template: `
    <div class="-icon">
      <ng-container *ngIf="icon === undefined; else iconTpl" [ngSwitch]="type">
        <mat-icon *ngSwitchCase="'error'">error</mat-icon>
        <mat-icon *ngSwitchCase="'info'">info</mat-icon>
        <mat-icon *ngSwitchCase="'success'">check_circle</mat-icon>
        <mat-icon *ngSwitchCase="'warning'">warning</mat-icon>
      </ng-container>
      <ng-template #iconTpl>
        <mat-icon *ngIf="icon">{{icon}}</mat-icon>
      </ng-template>
    </div>
    <div class="-body">
      <ng-content></ng-content>
    </div>
    <div class="-action">
      <ng-content select="app-alert-action"></ng-content>
      <span (click)="remove()">
        <ng-content select="[app-alert-close]"></ng-content>
      </span>
    </div>
  `,
  animations: [slideToggle],
})
export class AlertComponent implements OnInit {

  ngOnInit() {
    this.visible = this.getStorageId() ? localStorage.getItem(this.getStorageId()) !== 'true' : true;
  }

  @HostBinding('@slideToggle') visible = true;

  @Input() id?: string;

  @Input() icon?: string;

  @Input() type: AlertType;

  @Input()
  set autoHide(value: any) {
    if (value !== null) {
      setTimeout(() => this.visible = false, typeof value === 'number' ? value : 8000);
    }
  }

  readonly getStorageId = (): string | undefined => this.id ? 'AlertComponent_' + this.id + '_hidden' : undefined;

  remove(): void {
    const id = this.getStorageId();
    if (id) {
      localStorage.setItem(id, 'true');
    }
    this.visible = false;
  }
}

@NgModule({
  exports: [
    AlertActionComponent,
    AlertComponent,
    AlertCloseComponent,
  ],
  declarations: [
    AlertActionComponent,
    AlertComponent,
    AlertCloseComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class AlertModule {
}

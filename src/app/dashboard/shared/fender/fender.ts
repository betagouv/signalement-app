import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

export type FenderType = 'loading' | 'error' | 'empty' | 'success';

@Component({
  selector: 'app-fender',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./fender.scss'],
  host: {
    '[class.clr-success]': 'type == "success"',
    '[class.clr-error]': 'type == "error"',
  },
  template: `
    <div>
      <div *ngIf="icon">
        <mat-icon class="-ico">{{icon}}</mat-icon>
      </div>
      <div *ngIf="!icon" [ngSwitch]="type">
        <mat-icon class="-ico" *ngSwitchCase="'empty'">do_not_disturb</mat-icon>
        <mat-icon class="-ico" *ngSwitchCase="'error'">error</mat-icon>
        <mat-icon class="-ico" *ngSwitchCase="'success'">check_circle</mat-icon>
        <mat-progress-spinner *ngSwitchCase="'loading'" mode="indeterminate"></mat-progress-spinner>
      </div>
      <div class="-body">
        <div class="-title">
          <span #text>{{title}}</span>
        </div>
        <div *ngIf="description" class="-description">{{description}}</div>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class FenderComponent {
  @Input() type: FenderType = 'empty';

  @Input() icon?: string;

  @Input() private _title?: string;

  get title(): string {
    if (this._title !== undefined) {
      return this._title;
    }
    switch (this.type) {
      case 'loading':
        return 'Chargement...';
      case   'error':
        return 'Une erreur technique s\'est produite, veuillez réessayer ultérieurement.';
      case   'empty':
        return 'Aucun résultat.';
      case   'success':
        return 'Ok';
    }
  }

  @Input() description?: string;
}

@NgModule({
  exports: [
    FenderComponent,
  ],
  declarations: [
    FenderComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ]
})
export class FenderModule {
}

import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Directive({
  selector: '[appConfirm]',
  host: {
    '(click)': 'openDialog()'
  },
})
export class ConfirmDialogDirective {

  constructor(public dialog: MatDialog) {
  }

  @Input() appConfirm = true;
  @Input() title: string;
  @Input() content: string;
  @Input() disabled: boolean;
  @Output() confirmed = new EventEmitter();

  openDialog(): void {
    if (!this.appConfirm) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent);
    ref.componentInstance.title = this.title;
    ref.componentInstance.content = this.content;
    ref.componentInstance.disabled = this.disabled;
    ref.componentInstance.confirmed = this.confirmed;
  }
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 *ngIf="title" mat-dialog-title>{{title}}</h2>

    <mat-dialog-content *ngIf="content">
      <div [innerHTML]="content" class="txt-secondary"></div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">Annuler</button>
      <button [disabled]="disabled" mat-button color="primary" mat-dialog-close (click)="confirmed.emit()">
        Confirmer
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {

  @Input() title: string;
  @Input() content: string;
  @Input() disabled: boolean;
  @Output() confirmed = new EventEmitter();
}

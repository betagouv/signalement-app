import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnomalyService } from '../../../services/anomaly.service';

@Component({
  selector: 'app-select-tags',
  template: `
    <h2 mat-dialog-title>Sélectionner des tags</h2>

    <mat-dialog-content>
      <div *ngFor="let c of tags">
        <mat-checkbox [value]="c" [checked]="checked(c)" (change)="toggle(c)">
          {{c}}
        </mat-checkbox>
      </div>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">Annuler</button>
      <button mat-button color="primary" mat-dialog-close (click)="update()">
        Confirmer
      </button>
    </mat-dialog-actions>
  `,
})
export class SelectTagsDialogComponent {
  constructor(private anomalyService: AnomalyService,) {
  }

  @Input()
  set initialValues(value: string[]) {
    this.currentValues = new Set(value);
  }

  @Output() changed = new EventEmitter<string[]>();

  readonly tags = this.anomalyService.getTags();

  currentValues?: Set<string>;

  readonly checked = (c: string) => this.currentValues.has(c);

  readonly toggle = (c: string) => this.checked(c) ? this.currentValues.delete(c) : this.currentValues.add(c);

  readonly update = () => this.changed.emit([...this.currentValues]);
}

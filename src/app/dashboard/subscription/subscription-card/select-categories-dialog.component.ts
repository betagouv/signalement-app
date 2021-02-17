import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnomalyService } from '../../../services/anomaly.service';

@Component({
  selector: 'app-select-categories',
  template: `
    <h2 mat-dialog-title>Sélectionner des catégories</h2>

    <mat-dialog-content>
      <div *ngFor="let c of categories">
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
export class SelectCategoriesDialogComponent {
  constructor(private anomalyService: AnomalyService,) {
  }

  @Input()
  set initialValues(value: string[]) {
    this.currentValues = new Set(value);
  }

  @Output() changed = new EventEmitter<string[]>();

  currentValues?: Set<string>;

  readonly checked = (c: string) => this.currentValues.has(c);

  readonly toggle = (c: string) => this.checked(c) ? this.currentValues.delete(c) : this.currentValues.add(c);

  readonly categories = this.anomalyService.getCategories();

  readonly update = () => this.changed.emit([...this.currentValues]);
}

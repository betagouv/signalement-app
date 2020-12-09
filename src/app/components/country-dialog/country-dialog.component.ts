import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConstantService } from '../../services/constant.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Selectionner des pays</h2>

    <mat-dialog-content>
      <div *ngFor="let country of countries$ | async">
        <mat-checkbox [value]="country.name" [checked]="currentValues.has(country.name)" (change)="update($event)" ngDefaultControl>
          {{country.name}}
        </mat-checkbox>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">Annuler</button>
      <button mat-button mat-dialog-close color="primary" (click)="save()">
        Confirmer
      </button>
    </mat-dialog-actions>
  `,
})
export class CountryDialogComponent {

  constructor(
    private constantService: ConstantService,
  ) {
  }

  @Input()
  set values(values: string[]) {
    this.currentValues = new Set(values);
  }

  @Output() changed = new EventEmitter<string[]>();

  currentValues = new Set<string>();

  readonly countries$ = this.constantService.getCountries();

  readonly update = (event: MatCheckboxChange) => {
    this.currentValues[event.checked ? 'add' : 'delete'](event.source.value);
  };

  readonly save = () => {
    this.changed.emit([...this.currentValues]);
  };
}

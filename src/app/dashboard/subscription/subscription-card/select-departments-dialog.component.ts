import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Department, Regions } from '../../../model/Region';

@Component({
  selector: 'app-select-siret',
  template: `
    <h2 mat-dialog-title>Sélectionner des départements</h2>

    <mat-dialog-content>
      <div *ngFor="let c of departments">
        <mat-checkbox [value]="c" [checked]="checked(c)" (change)="toggle(c)">
          {{c.code}} - {{c.label}}
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
export class SelectDepartmentsDialogComponent {

  readonly regions = Regions;

  readonly departments = this.regions.flatMap(_ => _.departments).sort((a, b) => +a.code - +b.code);

  @Input()
  set initialValues(value: Department[]) {
    this.currentValues = value.reduce((acc, _) => acc.set(_.code, _), new Map<string, Department>());
  }

  @Output() changed = new EventEmitter<Department[]>();

  currentValues?: Map<string, Department>;

  readonly checked = (c: Department) => this.currentValues.has(c.code);

  readonly toggle = (c: Department) => this.checked(c) ? this.currentValues.delete(c.code) : this.currentValues.set(c.code, c);

  readonly update = () => this.changed.emit([...this.currentValues.values()]);
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConstantService } from '../../services/constant.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { combineLatest } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Country } from '../../model/Country';

interface Form {
  group: 'european' | 'transfer' | 'all';
  name: string;
}

const initialForm: Form = {
  name: '',
  group: 'all',
};

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <mat-progress-bar *ngIf="constantService.fetchingCountries" mode="indeterminate" class="app-mat-dialog-progress">
    </mat-progress-bar>

    <h2 mat-dialog-title>Selectionner des pays</h2>

    <ng-container [formGroup]="form">
      <div class="filters">
        <input matInput type="text" formControlName="name" placeholder="Rechercher..." class="input-invisible">
        <button mat-button matSuffix mat-icon-button (click)="filterName=''">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-radio-group class="radio-group" formControlName="group">
        <mat-radio-button value="all">Tous</mat-radio-button>
        <mat-radio-button value="european">Pays européen uniquement</mat-radio-button>
        <mat-radio-button value="transfer">Pays avec accord uniquement</mat-radio-button>
      </mat-radio-group>
    </ng-container>

    <mat-dialog-content class="content">
      <ng-container *ngIf="countries$ | async as countries">
        <div *ngFor="let country of countries">
          <mat-checkbox [value]="country.name" [checked]="currentValues.has(country.name)" (change)="update($event)" ngDefaultControl>
            {{country.name}}
          </mat-checkbox>
        </div>
        <div *ngIf="countries.length === 0" class="no-countries">
          Aucun pays ne correspond à votre recherche
        </div>
      </ng-container>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">Annuler</button>
      <button mat-button mat-dialog-close color="primary" (click)="save()">
        Confirmer
      </button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./country-dialog.component.scss']
})
export class CountryDialogComponent {

  constructor(
    private fb: FormBuilder,
    public constantService: ConstantService,
  ) {
  }

  @Input()
  set values(values: string[]) {
    this.currentValues = new Set(values);
  }

  @Output() changed = new EventEmitter<string[]>();

  currentValues = new Set<string>();

  filterName: string;

  form = this.fb.group(initialForm);

  private filters = ([countries, form]: [Country[], Form]) => {
    return countries.filter(_ =>
      _.name.toLowerCase().indexOf(form.name.toLowerCase()) !== -1
      && (form.group === 'european' ? _.european === true : true)
      && (form.group === 'transfer' ? _.transfer === true : true)
    );
  };

  countries$ = combineLatest([
    this.constantService.getCountries(),
    this.form.valueChanges.pipe(startWith(initialForm)),
  ]).pipe(
    distinctUntilChanged(),
    map(this.filters),
  );

  readonly update = (event: MatCheckboxChange) => {
    this.currentValues[event.checked ? 'add' : 'delete'](event.source.value);
  };

  readonly save = () => {
    this.changed.emit([...this.currentValues]);
  };
}

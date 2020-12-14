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
  templateUrl: './country-dialog.component.html',
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

  readonly form = this.fb.group(initialForm);

  private filters = ([countries, form]: [Country[], Form]) => {
    return countries.filter(_ =>
      _.name !== 'France'
      && _.name.toLowerCase().indexOf(form.name.toLowerCase()) !== -1
      && (form.group === 'european' ? _.european === true : true)
      && (form.group === 'transfer' ? _.transfer === true : true)
    );
  };

  readonly countries$ = combineLatest([
    this.constantService.getCountries(),
    this.form.valueChanges.pipe(startWith(initialForm)),
  ]).pipe(
    distinctUntilChanged(),
    map(this.filters),
  );

  readonly allSelected = (countries: Country[]) => countries.every(_ => this.currentValues.has(_.code));
  readonly allUnSelected = (countries: Country[]) => !countries.find(_ => this.currentValues.has(_.code));

  readonly toggleAll = (countries: Country[]) => {
    const action = this.allUnSelected(countries) ? 'add' : 'delete';
    countries.forEach(_ => this.currentValues[action](_.code));
  };

  readonly update = (event: MatCheckboxChange) => {
    this.currentValues[event.checked ? 'add' : 'delete'](event.source.value);
  };

  readonly save = () => {
    this.changed.emit([...this.currentValues]);
  };
}

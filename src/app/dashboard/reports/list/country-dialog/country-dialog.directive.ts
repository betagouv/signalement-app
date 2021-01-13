import { Directive, ElementRef, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CountryDialogComponent } from './country-dialog.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Directive({
  selector: '[appCountryDialog]',
  host: {
    '(click)': 'openDialog()'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CountryDialogDirective),
    multi: true
  }],
})
export class CountryDialogDirective implements ControlValueAccessor {

  constructor(private el: ElementRef, public dialog: MatDialog) {
  }

  openDialog(): void {
    const ref = this.dialog.open(CountryDialogComponent, {
      width: '500px',
    }).componentInstance;
    ref.values = this.innerValue;
    ref.changed.subscribe(values => this.value = values);
  }

  private innerValue: string[];

  set value(countries: string[]) {
    if (countries !== this.innerValue) {
      this.innerValue = countries;
      this.manuallyReflectChangeOnHostInput(countries);
      this.onChange(countries);
    }
  }

  writeValue(countries: string[]): void {
    this.manuallyReflectChangeOnHostInput(countries);
    this.innerValue = countries;
  }

  registerOnChange = (fn: any) => this.onChange = fn;

  registerOnTouched = (fn: any) => this.onTouched = fn;

  public onChange: any = (_: string[]): void => {
  };

  public onTouched: any = (): void => {
  };

  private manuallyReflectChangeOnHostInput = (countries?: string[]) => {
    // I expected it to be automatically done by formControlName directive,
    // but it has to be done manually.
    this.el.nativeElement.value = Array.isArray(countries) ? countries.join(', ') : countries;
  };
}
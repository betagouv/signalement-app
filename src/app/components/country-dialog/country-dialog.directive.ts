import { Directive, ElementRef, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CountryDialogComponent } from './country-dialog.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


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
export class CountryDialogDirective {

  constructor(private el: ElementRef, public dialog: MatDialog) {
  }

  openDialog(): void {
    const ref = this.dialog.open(CountryDialogComponent).componentInstance;
    ref.values = this.innerValue;
    ref.changed.subscribe(values => this.value = values);
  }

  private innerValue: string[];

  public onChange: any = (_) => {
  };

  public onTouched: any = () => {
  };

  get value(): string[] {
    return this.innerValue;
  }

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

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private manuallyReflectChangeOnHostInput = (countries: string[]) => {
    // I expected it to be automatically done by formControlName directive,
    // but it has to be done manually.
    this.el.nativeElement.value = countries.join(', ');
  };
}

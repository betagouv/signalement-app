import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Country } from '../../model/Country';

@Component({
  selector: 'app-country-input',
  template: `
    <input class="input-invisible">
  `,
  styleUrls: ['./country-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CountryInputComponent),
    multi: true
  }],
})
export class CountryInputComponent implements ControlValueAccessor {

  constructor() {
  }

  @Input() disabled?: boolean;

  @Input() placeholder?: string;

  @Input() countries: Country[];

  value: string[];

  writeValue(value: any): void {
    this.value = value;
    this.onChangeCallback(this.value);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onTouched = () => {
  };

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  onChangeCallback: (_: any) => void = (_: any) => {
  };

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

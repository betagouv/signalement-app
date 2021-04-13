import { AfterViewInit, Component, forwardRef, Input, } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  template: `
    <div class="row pb-2 pt-2">
      <div class="col col-radio z-0">
        <input type="radio" [name]="name" [value]="value" (change)="controlValueAccessorOnChange($event)" [id]="id"/>
      </div>
      <div class="col">
        <label class="d-block mb-0 pointer" [for]="id">
          <ng-content></ng-content>
        </label>
        <div class="note" [innerHTML]="description" *ngIf="description"></div>
      </div>
    </div>
  `,
  styleUrls: ['./radio-button.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButtonComponent),
    multi: true,
  }],
})
export class RadioButtonComponent implements ControlValueAccessor, AfterViewInit {

  // public formControl = new FormControl();

  @Input() id: string;

  @Input() name: string;

  @Input() description: string;

  private _value: string;

  @Input()
  set value(value: string) {
    this.writeValue(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  ngAfterViewInit() {
    // this.formControl.valueChanges.subscribe(this.controlValueAccessorOnChange);
  }

  writeValue(_: string): void {
    // this.value = _;
  }

  registerOnChange(fn: any): void {
    this.controlValueAccessorOnChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  controlValueAccessorOnChange: (_: any) => void = (_: any) => {
  };
}

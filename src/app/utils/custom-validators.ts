import {FormControl} from '@angular/forms';

export class CustomValidators {

  static readonly validatePhoneNumber = (control: FormControl) =>
    /^((\+)33|0|0033)[1-9]([.\-\s+]?\d{2}){4}$/g.test(control.value)
      ? null
      : { validatePhoneNumber: true };
}

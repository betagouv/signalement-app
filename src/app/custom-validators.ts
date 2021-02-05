import { FormControl } from '@angular/forms';

export class CustomValidators {

  static readonly validatePhoneNumber = (control: FormControl) => {
    const pattern = /^((\+)33|0|0033)[1-9]([.\-\s+]?\d{2}){4}$/g;
    if (pattern.test(control.value)) {
      return null;
    }
    return {
      validatePhoneNumber: true
    };
  };
}

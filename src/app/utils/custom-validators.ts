import {FormControl} from '@angular/forms';

export class CustomValidators {

  // static readonly validatePhoneNumber = (control: FormControl) => Validators.pattern(/^((\+)33|0|0033)[1-9]([.\-\s+]?\d{2}){4}$/g)(control);
  static readonly validatePhoneNumber = (control: FormControl) => {
    return (!control.value || control.value === '' || /^((\+)33|0|0033)[1-9]([.\-\s+]?\d{2}){4}$/g.test(control.value))
      ? null
      : {validatePhoneNumber: true};
  };

}

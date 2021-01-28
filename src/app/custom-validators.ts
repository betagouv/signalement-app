import { FormControl } from '@angular/forms';
import Utils from './utils';

export class CustomValidators {

  static readonly validatePhoneNumber = (control: FormControl) => {
    const sanitizedPhoneNumber = Utils.sanitizePhoneNumber(control.value);
    if (!sanitizedPhoneNumber
      || sanitizedPhoneNumber.length === 10
      || (sanitizedPhoneNumber.length === 11 && sanitizedPhoneNumber.startsWith('33'))) {
      return null;
    }
    return {
      validatePhoneNumber: {
        valid: false
      }
    };
  };
}

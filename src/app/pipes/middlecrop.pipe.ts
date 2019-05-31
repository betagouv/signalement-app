import { Pipe, PipeTransform } from '@angular/core';
import Utils from '../utils';

@Pipe({
  name: 'middleCrop'
})
export class MiddleCropPipe implements PipeTransform {
  transform(value: string, limit = 25) {
    if (value) {
      return Utils.textOverflowMiddleCropping(value, limit);
    }
  }
}

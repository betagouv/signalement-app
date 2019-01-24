import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precedeBy'
})
export class PrecedeByPipe implements PipeTransform {

  transform(value: string, plainText: string, apostrophiedText: string): any {
    value = value.toLowerCase();
    const apostropheRequiredLetters = ['a', 'e', 'i', 'o', 'u', 'y', 'h'];
    if (apostropheRequiredLetters.indexOf(value[0]) !== -1) {
      return `${apostrophiedText}${value}`;
    } else {
      return `${plainText} ${value}`;
    }
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { DraftCompany } from '../model/Company';

@Pipe({
  name: 'isForeign'
})
export class IsForeignPipe implements PipeTransform {
  transform(draftCompany: DraftCompany) {
    return draftCompany && draftCompany.country !== undefined && draftCompany.country !== 'France';
  }
}

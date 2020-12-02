import { Pipe, PipeTransform } from '@angular/core';
import { DraftCompany } from '../model/Company';

@Pipe({
  name: 'isForeign'
})
export class DraftCompanyPipe implements PipeTransform {
  transform(draftCompany: DraftCompany) {
    return draftCompany && draftCompany.country !== undefined;
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isGovernmentCompany } from '@betagouv/signalconso-api-sdk-js';
import { CompanySearchResult } from '../../model/Company';

@Component({
  selector: 'app-company-search-results',
  templateUrl: './company-search-results.component.html',
  styleUrls: ['./company-search-results.component.scss']
})
export class CompanySearchResultsComponent {

  @Input() companySearchResults: CompanySearchResult[];

  @Output() select = new EventEmitter<CompanySearchResult>();

  selectedCompany: CompanySearchResult;

  constructor() {
  }

  readonly isDisabled = isGovernmentCompany;

  readonly existsDisabled = () => !!this.companySearchResults?.find(this.isDisabled);

  getRadioContainerClass(input: CompanySearchResult, value: CompanySearchResult) {
    if (this.isDisabled(value)) {
      return '-disabled';
    }
    return input === value ? 'selected' : '';
  }
}

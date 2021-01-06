import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanySearchResult } from '../../model/Company';

@Component({
  selector: 'app-company-search-results',
  templateUrl: './company-search-results.component.html',
  styleUrls: ['./company-search-results.component.scss']
})
export class CompanySearchResultsComponent implements OnInit {

  @Input() companySearchResults: CompanySearchResult[];

  @Output() select = new EventEmitter<CompanySearchResult>();

  selectedCompany: CompanySearchResult;

  constructor() { }

  ngOnInit(): void {
  }

  getRadioContainerClass(input: any, value: any) {
    return input === value ? 'selected' : '';
  }

  selectCompany(companySearchResult: CompanySearchResult) {
    this.select.emit(companySearchResult);
  }
}

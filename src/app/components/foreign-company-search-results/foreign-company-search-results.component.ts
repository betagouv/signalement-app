import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Country} from "../../model/Country";

@Component({
  selector: 'app-foreign-company-search-results',
  templateUrl: './foreign-company-search-results.component.html',
  styleUrls: ['./foreign-company-search-results.component.scss']
})
export class ForeignCompanySearchResultsComponent {

  @Input() companyCountriesResults: Country[];

  @Output() select = new EventEmitter<Country>();

  selectedCountry: Country;

  constructor() {
    console.log("--------------------------")
    console.log(this.selectedCountry)
    console.log(this.companyCountriesResults)
  }

  getRadioContainerClass(input: Country, value: Country) {
    console.log("'''''''''''''''")
    console.log(this.companyCountriesResults)
    return input === value ? 'selected' : '';
  }
}

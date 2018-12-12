import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Company, CompanySearchResult } from '../../model/Company';
import { CompanyService, MaxCompanyResult } from '../../services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../../services/address.service';
import { CompleterItem, RemoteData } from 'ng2-completer';
import { City } from '../../model/City';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {

  companyForm: FormGroup;
  nameCtrl: FormControl;
  cityCtrl: FormControl;
  addressCtrl: FormControl;

  companies: Company[];
  total: number;
  searchEnabled: boolean;
  showErrors: boolean;

  cityData: RemoteData;
  addressData: RemoteData;
  citySelected: City;
  addressSelected: string;

  @Output() companySelected = new EventEmitter<Company>();

  constructor(private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private addressService: AddressService) {

  }

  ngOnInit() {
    this.nameCtrl = this.formBuilder.control('', Validators.required);
    this.cityCtrl = this.formBuilder.control('', Validators.required);
    this.addressCtrl = this.formBuilder.control('', Validators.required);

    this.companyForm = this.formBuilder.group({
      name: this.nameCtrl,
      city: this.cityCtrl
    });

    this.showErrors = false;
    this.searchEnabled = true;

    this.cityData = this.addressService.getCityData();

    this.initSearch();
  }

  initSearch() {
    this.companies = [];
    this.total = 0;
  }

  submitCompanyForm() {
    if (!this.companyForm.valid) {
      this.showErrors = true;
    } else {
      this.searchCompany();
    }
  }

  searchCompany() {
    this.initSearch();
    this.companyService.searchByNameCityAndAddress(this.nameCtrl.value, this.getCity(), this.addressCtrl.value).subscribe(
      companySearchResult => {
        this.total = companySearchResult.total;
        if (this.total === 0) {
          this.treatCaseNoResult();
        } else if (this.total === 1) {
          this.treatCaseOneResult(companySearchResult);
        } else if (this.total > MaxCompanyResult) {
          this.treatCaseTooManyResults();
        } else {
          this.treatCaseManyResults(companySearchResult);
        }
      }
    );
  }

  getCity() {
    return this.citySelected ? this.citySelected : this.cityCtrl.value;
  }

  treatCaseNoResult() {
    if (this.companyForm.contains('address')) {
      this.saveCompanyFromSearchForm();
    } else {
      this.disableNameAndCityAddress();
      this.enableAddressEntry();
    }
  }

  treatCaseOneResult(companySearchResult: CompanySearchResult) {
    this.searchEnabled = false;
    this.selectCompany(companySearchResult.companies[0]);
  }

  treatCaseTooManyResults() {
    if (this.companyForm.contains('address')) {
      this.saveCompanyFromSearchForm();
    } else {
      this.disableNameAndCityAddress();
      this.enableAddressEntry();
    }
  }

  treatCaseManyResults(companySearchResult) {
    this.searchEnabled = false;
    this.companyForm.controls['name'].disable();
    this.companyForm.controls['city'].disable();
    this.companies = companySearchResult.companies;
  }

  disableNameAndCityAddress() {
    this.companyForm.controls['name'].disable();
    this.companyForm.controls['city'].disable();
  }

  enableAddressEntry() {
    this.showErrors = false;
    this.companyForm.addControl('address', this.addressCtrl);
    this.addressData = this.addressService.getAddressData(this.getCity());
  }

  selectCompany(company: Company) {
    this.companySelected.emit(company);
  }

  modifySearch() {
    this.companies = [];
    this.companyForm.removeControl('address');
    this.addressCtrl.reset();
    this.companyForm.controls['name'].enable();
    this.companyForm.controls['city'].enable();
    this.searchEnabled = true;
  }

  saveCompanyFromSearchForm() {
    this.selectCompany(
      Object.assign(
        new Company(),
        {
          name: this.nameCtrl.value,
          line1: this.nameCtrl.value,
          line2: this.addressSelected ? this.addressSelected : this.addressCtrl.value,
          line3: this.citySelected ? `${this.citySelected.postcode} ${this.citySelected.name}` : this.cityCtrl.value,
          postcode: this.citySelected ? this.citySelected.postcode : ''
        }
      )
    );
  }

  selectCity(selected: CompleterItem) {
    if (selected && selected.originalObject) {
      this.citySelected = Object.assign(new City(), {
        name: selected.originalObject.name,
        postcode: selected.originalObject.postcode
      });
    }
  }

  unselectCity() {
    this.citySelected = undefined;
  }

  selectAddress(selected: CompleterItem) {
    if (selected && selected.originalObject) {
      this.addressSelected = selected.originalObject.name;
      this.citySelected = Object.assign(new City(), {
        name: selected.originalObject.city,
        postcode: selected.originalObject.postcode
      });
    }
  }

  unselectAddress() {
    this.addressSelected = undefined;
  }
}

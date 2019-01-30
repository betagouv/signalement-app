import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Company, CompanySearchResult } from '../../../model/Company';
import { CompanyService, MaxCompanyResult } from '../../../services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../../../services/address.service';
import { CompleterItem, RemoteData } from 'ng2-completer';
import { AnalyticsService, CompanyEventActions, CompanySearchEventNames, EventCategories } from '../../../services/analytics.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  searchForm: FormGroup;
  searchCtrl: FormControl;
  searchPostalCodeCtrl: FormControl;

  companyForm: FormGroup;
  nameCtrl: FormControl;
  addressCtrl: FormControl;
  addressCtrlPostalCode: string;

  companies: Company[];
  loading: boolean;
  searchWarning: string;

  showErrors: boolean;

  addressData: RemoteData;
  @Output() validate = new EventEmitter<Company>();

  constructor(private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private addressService: AddressService,
              private analyticsService: AnalyticsService) {

  }

  ngOnInit() {
    this.initSearchForm();
  }

  initSearchForm() {
    this.searchCtrl = this.formBuilder.control('', Validators.required);
    this.searchPostalCodeCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{5}')]));
    this.searchForm = this.formBuilder.group({
      search: this.searchCtrl,
      searchPostalCode: this.searchPostalCodeCtrl
    });
  }

  editCompany() {
    this.showErrors = false;
    this.nameCtrl = this.formBuilder.control('', Validators.required);
    this.addressCtrl = this.formBuilder.control('', Validators.required);
    this.addressCtrlPostalCode = '';
    this.companyForm = this.formBuilder.group({
      name: this.nameCtrl,
      address: this.addressCtrl,
    });
    this.addressData = this.addressService.addressData;
  }

  initSearch() {
    this.companyForm = null;
    this.companies = [];
    this.searchWarning = '';
  }

  searchCompany() {
    if (!this.searchForm.valid) {
      this.showErrors = true;
    } else {
      this.initSearch();
      this.loading = true;
      this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, this.searchCtrl.value + " " + this.searchPostalCodeCtrl.value);
      this.companyService.searchCompanies(this.searchCtrl.value, this.searchPostalCodeCtrl.value).subscribe(
        companySearchResult => {
          this.loading = false;
          if (companySearchResult.total === 0) {
            this.treatCaseNoResult();
          } else if (companySearchResult.total === 1) {
            this.treatCaseSingleResult(companySearchResult);
          } else if (companySearchResult.total > MaxCompanyResult) {
            this.treatCaseTooManyResults();
          } else {
            this.treatCaseSeveralResults(companySearchResult);
          }
        }
      );
    }
  }

  treatCaseNoResult() {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.noResult);
    this.searchWarning = 'Aucun établissement ne correspond à la recherche.';
  }

  treatCaseSingleResult(companySearchResult: CompanySearchResult) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.singleResult);
    this.companies = companySearchResult.companies;
  }

  treatCaseTooManyResults() {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.tooManyResults);
    this.searchWarning = 'Il y a trop d\'établissement correspondant à la recherche.';
  }

  treatCaseSeveralResults(companySearchResult) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.severalResult);
    this.companies = companySearchResult.companies;
  }

  selectCompanyFromResults(company: Company) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.select);
    this.selectCompany(company);
  }

  selectCompany(company: Company) {
    this.validate.emit(company);
  }

  submitCompanyForm() {
    if (!this.companyForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.manualEntry);
      this.selectCompany(
        Object.assign(
          new Company(),
          {
            name: this.nameCtrl.value,
            line1: this.nameCtrl.value,
            line2: this.addressCtrl.value,
            postalCode: this.addressCtrlPostalCode
          }
        )
      );
    }
  }

  selectAddress(selected: CompleterItem) {
    this.addressCtrlPostalCode = '';
    if (selected) {
      this.addressCtrlPostalCode = selected.originalObject.postcode;
    }
  }
}

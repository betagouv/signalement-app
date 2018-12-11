import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Company, CompanySearchResult } from '../../model/Company';
import { CompanyService, MaxCompanyResult } from '../../services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  tooManyResult: boolean;
  showErrors: boolean;

  @Output() companySelected = new EventEmitter<Company>();

  constructor(private formBuilder: FormBuilder,
              private companyService: CompanyService) {

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
    this.tooManyResult = false;

    this.initSearch();
  }

  initSearch() {
    this.companies = [];
    this.total = 0;
    this.tooManyResult = false;
  }

  submitCompanyForm() {
    if (!this.companyForm.valid) {
      this.showErrors = true;
    } else if (this.companyForm.contains('address')) {
      this.saveCompanyFromSearchForm();
    } else {
      this.searchCompany();
    }
  }

  searchCompany() {
    this.initSearch();
    this.companyService.searchByNameAndPostCode(this.nameCtrl.value, this.cityCtrl.value).subscribe(
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

  treatCaseNoResult() {
    this.searchEnabled = false;
    this.showErrors = false;
    this.companyForm.controls['name'].disable();
    this.companyForm.controls['city'].disable();
    this.companyForm.addControl('address', this.addressCtrl);
  }

  treatCaseOneResult(companySearchResult: CompanySearchResult) {
    this.searchEnabled = false;
    this.selectCompany(companySearchResult.companies[0]);
  }

  treatCaseTooManyResults() {
    this.tooManyResult = true;
  }

  treatCaseManyResults(companySearchResult) {
    this.searchEnabled = false;
    this.companyForm.controls['name'].disable();
    this.companyForm.controls['city'].disable();
    this.companies = companySearchResult.companies;
  }

  selectCompany(company: Company) {
    this.companySelected.emit(company);
  }

  modifySearch() {
    this.companies = [];
    this.companyForm.removeControl('address');
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
          line2: this.addressCtrl.value,
          line3: this.cityCtrl.value
        }
      )
    );
  }
}

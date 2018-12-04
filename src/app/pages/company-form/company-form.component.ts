import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Company } from '../../model/Company';
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

    this.initSearch();
  }

  initSearch() {
    this.companies = [];
    this.total = 0;
  }

  searchCompany() {
    this.initSearch();
    this.companyService.searchByNameAndPostCode(this.nameCtrl.value, this.cityCtrl.value).subscribe(
      companySearchResult => {
        this.total = companySearchResult.total;
        if (this.total === 0) {
          this.companyForm.addControl('address', this.addressCtrl);
        } else if (this.total === 1) {
          this.selectCompany(companySearchResult.companies[0]);
        } else if (!this.hasTooManyResults()) {
          this.companies = companySearchResult.companies;
        }
      }
    );
  }

  hasTooManyResults() {
    return this.total > MaxCompanyResult;
  }

  selectCompany(company: Company) {
    this.companySelected.emit(company);
  }
}

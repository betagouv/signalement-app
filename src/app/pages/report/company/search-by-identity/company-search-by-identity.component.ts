import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DraftCompany, Country } from '@signal-conso/signalconso-api-sdk-js';
import { AnalyticsService, CompanySearchEventActions, EventCategories } from '../../../../services/analytics.service';
import { SearchCompanyByIdentityService } from '../../../../services/company.service';
import { RendererService } from '../../../../services/renderer.service';
import { IdentificationKinds } from '../company.component';
import { CompanyKinds } from '../../../../model/Anomaly';
import { CompanySearchResult } from '../../../../model/Company';

@Component({
  selector: 'app-company-search-by-identity',
  templateUrl: './company-search-by-identity.component.html',
  styleUrls: ['./company-search-by-identity.component.scss', '../company.component.scss']
})
export class CompanySearchByIdentityComponent implements OnInit {

  @ViewChild('identByIdentityResult')
  private identByIdentityResult: ElementRef;

  @Input() companyKind: CompanyKinds;
  @Input() isVendor: boolean;

  @Output() complete = new EventEmitter<DraftCompany>();
  @Output() loading = new EventEmitter<boolean>();

  companyKinds = CompanyKinds;

  searchByIdentityForm: FormGroup;
  identityCtrl: FormControl;
  companySearchByIdentityResults: CompanySearchResult[];

  selectedCompany: DraftCompany;
  selectedCountry: Country;

  showErrorsByIdentity: boolean;
  searchByIdentityWarning: string;
  searchByIdentityError: string;

  constructor(public formBuilder: FormBuilder,
              private searchCompanyByIdentityService: SearchCompanyByIdentityService,
              private rendererService: RendererService,
              private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.initSearchByIdentityForm();
  }

  initSearchByIdentityForm() {
    this.identityCtrl = this.formBuilder.control('', Validators.required);
    this.searchByIdentityForm = this.formBuilder.group({
      identity: this.identityCtrl,
    });
  }

  initSearchByIdentity() {
    this.selectedCompany = undefined;
    this.companySearchByIdentityResults = [];
    this.searchByIdentityWarning = '';
    this.searchByIdentityError = '';
    this.showErrorsByIdentity = false;
  }

  searchCompanyByIdentity() {
    this.initSearchByIdentity();
    if (!this.searchByIdentityForm.valid) {
      this.showErrorsByIdentity = true;
    } else {
      this.initSearchByIdentity();
      this.loading.emit(true);
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.searchByIdentity, this.identityCtrl.value);

      this.searchCompanyByIdentityService.list({ clean: false }, this.identityCtrl.value).subscribe(
        companySearchResults => {
          this.loading.emit(false);
          if (companySearchResults.length === 0) {
            this.searchByIdentityWarning = 'Aucun établissement ne correspond à la recherche.';
          } else {
            this.companySearchByIdentityResults = companySearchResults;
            this.rendererService.scrollToElement(this.identByIdentityResult.nativeElement);
          }
        },
        err => {
          this.loading.emit(false);
          this.searchByIdentityError = 'Une erreur technique s\'est produite.';
        });
    }
  }

  selectCompany(companySearchResult: CompanySearchResult) {
    this.selectedCompany = companySearchResult;
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select, IdentificationKinds.Identity);
    this.rendererService.scrollToElementEnd(this.identByIdentityResult.nativeElement);
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select, IdentificationKinds.Identity);
    this.rendererService.scrollToElementEnd(this.identByIdentityResult.nativeElement);
  }

  submitCompany() {
    this.complete.emit(this.selectedCompany);
  }

  hasError(formControl: FormControl) {
    return this.showErrorsByIdentity && formControl.errors;
  }

}

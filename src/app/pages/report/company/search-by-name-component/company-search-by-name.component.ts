import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DraftCompany } from '@betagouv/signalconso-api-sdk-js';
import { RendererService } from '../../../../services/renderer.service';
import { AnalyticsService, CompanySearchEventActions, EventCategories } from '../../../../services/analytics.service';
import { SearchCompanyService } from '../../../../services/company.service';
import { IdentificationKinds } from '../company.component';
import { CompanySearchResult } from '../../../../model/Company';

@Component({
  selector: 'app-company-search-by-name-component',
  templateUrl: './company-search-by-name.component.html',
  styleUrls: ['./company-search-by-name.component.scss', '../company.component.scss']
})
export class CompanySearchByNameComponent implements OnInit {

  @ViewChild('identResult')
  private identResult: ElementRef;

  @Input() isVendor: boolean;

  @Output() complete = new EventEmitter<DraftCompany>();
  @Output() changeIdentificationKind = new EventEmitter<IdentificationKinds>();
  @Output() loading = new EventEmitter<boolean>();

  searchForm: FormGroup;
  searchCtrl: FormControl;
  searchPostalCodeCtrl: FormControl;
  companySearchResults: CompanySearchResult[];

  selectedCompany: DraftCompany;

  isForeignCountry = false;

  showErrors: boolean;
  searchWarning: string;
  searchError: string;

  constructor(public formBuilder: FormBuilder,
              private searchCompanyService: SearchCompanyService,
              private rendererService: RendererService,
              private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
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

  searchCompany() {
    this.selectedCompany = undefined;
    this.companySearchResults = [];
    this.searchWarning = '';
    this.searchError = '';
    if (!this.searchForm.valid) {
      this.showErrors = true;
    } else {
      this.loading.emit(true);
      this.analyticsService.trackEvent(
        EventCategories.companySearch,
        CompanySearchEventActions.search,
        this.searchCtrl.value + ' ' + this.searchPostalCodeCtrl.value
      );
      this.searchCompanyService.list({ clean: false }, this.searchCtrl.value, this.searchPostalCodeCtrl.value).subscribe(
        companySearchResults => {
          this.loading.emit(false);
          if (companySearchResults.length === 0) {
            this.searchWarning = 'Aucun établissement ne correspond à la recherche.';
          } else {
            this.companySearchResults = companySearchResults;
            this.rendererService.scrollToElement(this.identResult.nativeElement);
          }
        },
        () => {
          this.loading.emit(false);
          this.searchError = 'Une erreur technique s\'est produite.';
        }
      );
    }
  }

  selectCompany(draftCompany: DraftCompany, autoSubmit?: boolean) {
    this.selectedCompany = draftCompany;
    if (autoSubmit) {
      this.submitCompany();
    } else {
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select, IdentificationKinds.Name);
      this.rendererService.scrollToElementEnd(this.identResult.nativeElement);
    }
  }

  submitCompany() {
    this.complete.emit(this.selectedCompany);
  }

  switchToIdentByIdentity() {
    this.changeIdentificationKind.emit(IdentificationKinds.Identity);
  }

  switchToForeignCountry() {
    this.isForeignCountry = true;
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompanySearchResult, DraftCompany } from '../../../../model/Company';
import { CompanyService } from '../../../../services/company.service';
import { RendererService } from '../../../../services/renderer.service';
import { AnalyticsService, CompanySearchEventActions, EventCategories } from '../../../../services/analytics.service';
import { DraftReport } from '../../../../model/Report';
import { IdentificationKinds } from '../company.component';
import { CustomValidators } from '../../../../custom-validators';

@Component({
  selector: 'app-company-search-by-phone',
  templateUrl: './company-search-by-phone.component.html',
  styleUrls: ['./company-search-by-phone.component.scss']
})
export class CompanySearchByPhoneComponent implements OnInit {

  @ViewChild('identByPhoneResult')
  private identByPhoneResult?: ElementRef;

  @Input() draftReport?: DraftReport;

  @Output() complete = new EventEmitter<DraftCompany & {vendor?: string}>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() change = new EventEmitter();

  readonly phoneCtrl = this.formBuilder.control(this.draftReport?.draftCompany.phone ?? '', [
    Validators.required,
    CustomValidators.validatePhoneNumber
  ]);
  readonly phoneForm = this.formBuilder.group({
    phone: this.phoneCtrl
  });

  companySearchByPhoneResults?: CompanySearchResult[];
  showErrors = false;
  searchError?: string;

  selectedCompany?: CompanySearchResult;

  constructor(public formBuilder: FormBuilder,
              private companyService: CompanyService,
              private rendererService: RendererService,
              private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
  }

  initSearchByPhone() {
    this.companySearchByPhoneResults = [];
    this.selectedCompany = undefined;
    this.showErrors = false;
    this.searchError = '';
  }

  searchCompanyByPhone() {
    this.initSearchByPhone();
    if (!this.phoneForm.valid) {
      this.showErrors = true;
    } else {
      this.loading.emit(true);
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.searchByPhone, this.phoneCtrl.value);

      this.companyService.searchCompaniesByPhone(this.phoneCtrl.value).subscribe(
        companySearchResults => {
          this.loading.emit(false);
          this.phoneForm.disable();
          if (companySearchResults.length === 0) {
            this.submitPhoneOnly();
          } else {
            this.companySearchByPhoneResults = companySearchResults;
            this.rendererService.scrollToElement(this.identByPhoneResult?.nativeElement);
          }
        },
        () => {
          this.loading.emit(false);
          this.searchError = 'Une erreur technique s\'est produite.';
        }
      );

    }
  }

  selectCompany(companySearchResult: CompanySearchResult) {
    this.selectedCompany = companySearchResult;
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select, IdentificationKinds.Phone);
    this.rendererService.scrollToElementEnd(this.identByPhoneResult?.nativeElement);
  }

  submitPhoneOnly() {
    this.complete.emit({ phone: this.phoneCtrl.value });
    this.initSearchByPhone();
  }

  submitCompany() {
    this.complete.emit({
      ...this.selectedCompany,
      phone: this.phoneCtrl.value
    });
  }

  changePhone() {
    this.initSearchByPhone();
    this.phoneForm.enable();
    this.change.emit();
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

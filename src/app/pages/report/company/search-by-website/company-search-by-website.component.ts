import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country, DraftCompany, WebsiteKind } from '@betagouv/signalconso-api-sdk-js';
import { SearchCompanyByURLService, SearchForeignCompanyByURLService } from '../../../../services/company.service';
import { RendererService } from '../../../../services/renderer.service';
import { AnalyticsService, CompanySearchEventActions, EventCategories } from '../../../../services/analytics.service';
import { DraftReport } from '../../../../model/Report';
import { IdentificationKinds } from '../company.component';
import { CompanySearchResult } from '../../../../model/Company';

@Component({
  selector: 'app-company-search-by-website',
  templateUrl: './company-search-by-website.component.html',
  styleUrls: ['./company-search-by-website.component.scss']
})
export class CompanySearchByWebsiteComponent implements OnInit {

  @ViewChild('identByUrlResult')
  private identByUrlResult: ElementRef;

  @ViewChild('identByUrlCountryResult')
  private identByUrlCountryResult: ElementRef;

  @Input() draftReport: DraftReport;

  @Output() complete = new EventEmitter<Partial<DraftCompany & {vendor?: string}>>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() change = new EventEmitter();

  websiteKinds = WebsiteKind;

  websiteForm: FormGroup;
  urlCtrl: FormControl;
  companySearchByUrlResults: CompanySearchResult[];
  companyCountriesSearchByUrlResults: Country[];
  vendorCtrl: FormControl;
  showErrors: boolean;
  searchError: string;

  selectedCompany?: CompanySearchResult;
  selectedCountry?: Country;

  UrlPattern = '^(http|https):\\/\\/(www\\.)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,}(:[0-9]{1,5})?(\\/.*)?$';

  constructor(public formBuilder: FormBuilder,
              private searchCompanyService: SearchCompanyByURLService,
              private searchForeignCompanyService: SearchForeignCompanyByURLService,
              private rendererService: RendererService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    this.initWebsiteForm();
  }

  initWebsiteForm() {
    this.urlCtrl = this.formBuilder.control(
      this.draftReport.draftCompany && this.draftReport.draftCompany.website ? this.draftReport.draftCompany.website.url : '',
      Validators.compose([
        Validators.required,
        Validators.pattern(this.UrlPattern)
      ])
    );
    this.websiteForm = this.formBuilder.group({
      url: this.urlCtrl
    });

    this.vendorCtrl = this.formBuilder.control(this.draftReport.vendor);
  }

  initSearchByUrl() {
    this.companySearchByUrlResults = [];
    this.companyCountriesSearchByUrlResults = [];
    this.selectedCompany = undefined;
    this.selectedCountry = undefined;
    this.vendorCtrl.setValue(undefined);
    this.showErrors = false;
    this.searchError = '';
  }

  searchCompanyByWebsite() {
    this.initSearchByUrl();
    if (!this.websiteForm.valid) {
      this.showErrors = true;
    } else {
      this.loading.emit(true);
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.searchByUrl, this.urlCtrl.value);

      this.searchCompanyService.list({clean: false}, this.urlCtrl.value).subscribe(
        companySearchResults => {
          this.loading.emit(false);
          this.websiteForm.disable();
          if (companySearchResults.length === 0) {
            this.searchForeignCompanyService.list({clean: false}, this.urlCtrl.value).subscribe(
              results => {
                if (results.length === 0) {
                  this.submitWebsiteOnly();
                } else {
                this.companyCountriesSearchByUrlResults = results;
                this.rendererService.scrollToElement(this.identByUrlCountryResult.nativeElement);
              }
              },
              () => {
                this.loading.emit(false);
                this.searchError = 'Une erreur technique s\'est produite.';
              }
            );
          } else {
            this.companySearchByUrlResults = companySearchResults;
            this.rendererService.scrollToElement(this.identByUrlResult.nativeElement);
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
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select, IdentificationKinds.Url);
    this.rendererService.scrollToElementEnd(this.identByUrlResult.nativeElement);
  }


  selectCountry(country: Country) {
    this.selectedCountry = country;
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select, IdentificationKinds.Identity);
    this.rendererService.scrollToElementEnd(this.identByUrlCountryResult.nativeElement);
  }

  submitWebsiteOnly() {
    this.complete.emit({website: {url: this.urlCtrl.value}});
    this.initSearchByUrl();
  }

  submitCompany() {
    this.complete.emit({
      ...this.selectedCompany,
      website: { url: this.urlCtrl.value },
      vendor: this.vendorCtrl ? this.vendorCtrl.value : undefined
    });
  }

  submitCountry() {
    this.complete.emit({
      address: {
        country : this.selectedCountry.name
      },
      website: {url: this.urlCtrl.value}
    });
  }

  changeWebsite() {
    this.initSearchByUrl();
    this.websiteForm.enable();
    this.change.emit();
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

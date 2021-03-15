import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanySearchResult, DraftCompany, WebsiteURL, } from '../../../../model/Company';
import { CompanyService } from '../../../../services/company.service';
import { RendererService } from '../../../../services/renderer.service';
import { AnalyticsService, CompanySearchEventActions, EventCategories } from '../../../../services/analytics.service';
import { DraftReport } from '../../../../model/Report';
import { IdentificationKinds } from '../company.component';
import { ApiWebsiteKind } from '../../../../api-sdk/model/ApiWebsite';

@Component({
  selector: 'app-company-search-by-website',
  templateUrl: './company-search-by-website.component.html',
  styleUrls: ['./company-search-by-website.component.scss']
})
export class CompanySearchByWebsiteComponent implements OnInit {

  @ViewChild('identByUrlResult')
  private identByUrlResult: ElementRef;

  @Input() draftReport: DraftReport;

  @Output() complete = new EventEmitter<DraftCompany & {vendor?: string}>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() change = new EventEmitter();

  websiteKinds = ApiWebsiteKind;

  websiteForm: FormGroup;
  urlCtrl: FormControl;
  companySearchByUrlResults: CompanySearchResult[];
  vendorCtrl: FormControl;
  showErrors: boolean;
  searchError: string;

  selectedCompany: CompanySearchResult;

  UrlPattern = '^(http|https):\\/\\/(www\\.)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,}(:[0-9]{1,5})?(\\/.*)?$';

  constructor(public formBuilder: FormBuilder,
              private companyService: CompanyService,
              private rendererService: RendererService,
              private analyticsService: AnalyticsService) { }

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
    this.selectedCompany = undefined;
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

      this.companyService.searchCompaniesByUrl(this.urlCtrl.value).subscribe(
        companySearchResults => {
          this.loading.emit(false);
          this.websiteForm.disable();
          if (companySearchResults.length === 0) {
            this.submitWebsiteOnly();
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

  submitWebsiteOnly() {
    this.complete.emit({ website: { url: this.urlCtrl.value } });
    this.initSearchByUrl();
  }

  submitCompany() {
    this.complete.emit({
      ...this.selectedCompany,
      website: { url: this.urlCtrl.value },
      vendor: this.vendorCtrl ? this.vendorCtrl.value : undefined
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

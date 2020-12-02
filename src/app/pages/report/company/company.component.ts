import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { CompanyService } from '../../../services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnalyticsService, CompanySearchEventActions, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';
import { CompanyKinds } from '../../../model/Anomaly';
import { CompanySearchResult, DraftCompany, Website, WebsiteKinds } from '../../../model/Company';
import { isPlatformBrowser } from '@angular/common';
import Utils from '../../../utils';
import { RendererService } from '../../../services/renderer.service';

declare var jQuery: any;

export enum IdentificationKinds {
  Name = 'Name', Identity = 'Identity', None = 'None', Url = 'Url'
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  @ViewChild('searchKind')
  private searchKind: ElementRef;
  @ViewChild('identSearch')
  private identSearch: ElementRef;
  @ViewChild('identByUrlResult')
  private identByUrlResult: ElementRef;
  @ViewChild('identResult')
  private identResult: ElementRef;
  @ViewChild('identByIdentityResult')
  private identByIdentityResult: ElementRef;

  step: Step;
  draftReport: DraftReport;
  companyKinds = CompanyKinds;

  websiteForm: FormGroup;
  urlCtrl: FormControl;
  companySearchByUrlResults: CompanySearchResult[];
  vendorCtrl: FormControl;

  searchForm: FormGroup;
  searchCtrl: FormControl;
  searchPostalCodeCtrl: FormControl;
  companySearchResults: CompanySearchResult[];
  showErrors: boolean;
  searchWarning: string;
  searchError: string;

  searchByIdentityForm: FormGroup;
  identityCtrl: FormControl;
  companySearchByIdentityResults: CompanySearchResult[];
  showErrorsByIdentity: boolean;
  searchByIdentityWarning: string;
  searchByIdentityError: string;

  selectedCompany: CompanySearchResult;

  loading: boolean;

  identificationKinds = IdentificationKinds;
  identificationKind: IdentificationKinds;
  websiteKinds = WebsiteKinds;

  changeDraftCompany = false;

  UrlPattern = '^(http|https):\\/\\/(www\\.)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,}(:[0-9]{1,5})?(\\/.*)?$';

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private companyService: CompanyService,
              private analyticsService: AnalyticsService,
              private rendererService: RendererService) { }

  ngOnInit() {
    this.step = Step.Company;
    this.reportStorageService.retrieveReportInProgress()
      .pipe(take(1))
      .subscribe(report => {
        if (report) {
          this.draftReport = report;
          this.checkExistingCompanyCompliance();
          if (this.draftReport.companyKind === CompanyKinds.SIRET) {
            this.initDefaultForms();
          } else if (this.draftReport.companyKind === CompanyKinds.WEBSITE) {
            this.identificationKind = IdentificationKinds.Url;
            this.initWebsiteForm();
          }
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  checkExistingCompanyCompliance() {
    const draftCompany = this.draftReport.draftCompany;
    if (draftCompany) {
      if ((this.draftReport.companyKind === CompanyKinds.SIRET && draftCompany.website) ||
        (this.draftReport.companyKind === CompanyKinds.WEBSITE && !draftCompany.website)) {
        this.draftReport.draftCompany = undefined;
      }
    }
  }

  initSearchForm() {
    this.searchCtrl = this.formBuilder.control('', Validators.required);
    this.searchPostalCodeCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{5}')]));
    this.searchForm = this.formBuilder.group({
      search: this.searchCtrl,
      searchPostalCode: this.searchPostalCodeCtrl
    });
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

  initSearchByIdentityForm() {
    this.identityCtrl = this.formBuilder.control('', Validators.required);
    this.searchByIdentityForm = this.formBuilder.group({
      identity: this.identityCtrl,
    });
  }

  initSearch() {
    this.companySearchResults = [];
    this.searchWarning = '';
    this.searchError = '';
    this.selectedCompany = undefined;
  }

  initSearchByIdentity() {
    this.companySearchByIdentityResults = undefined;
    this.searchByIdentityWarning = '';
    this.searchByIdentityError = '';
  }

  initSearchByUrl() {
    this.companySearchByUrlResults = [];
    this.selectedCompany = undefined;
    this.vendorCtrl.setValue(undefined);
  }

  searchCompany() {
    if (!this.searchForm.valid) {
      this.showErrors = true;
    } else {
      this.initSearch();
      this.loading = true;
      this.analyticsService.trackEvent(
        EventCategories.companySearch,
        CompanySearchEventActions.search,
        this.searchCtrl.value + ' ' + this.searchPostalCodeCtrl.value);
      this.companyService.searchCompanies(this.searchCtrl.value, this.searchPostalCodeCtrl.value).subscribe(
        companySearchResults => {
          this.loading = false;
          if (companySearchResults.length === 0) {
            this.searchWarning = 'Aucun établissement ne correspond à la recherche.';
          } else {
            this.companySearchResults = companySearchResults;
            this.rendererService.scrollToElement(this.identResult.nativeElement);
          }
        },
        () => {
          this.loading = false;
          this.searchError = 'Une erreur technique s\'est produite.';
        }
      );
    }
  }

  submitWebsiteForm() {
    this.showErrors = false;
    if (!this.websiteForm.valid) {
      this.showErrors = true;
    } else {
      this.initSearchByUrl();
      this.loading = true;
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.searchByUrl, this.urlCtrl.value);

      this.companyService.searchCompaniesByUrl(this.urlCtrl.value).subscribe(
        companySearchResults => {
          this.loading = false;
          if (companySearchResults.length === 0) {
            this.initDefaultIdent();
          } else {
            this.companySearchByUrlResults = companySearchResults;
            this.rendererService.scrollToElement(this.identByUrlResult.nativeElement);
          }
        },
        () => {
          this.loading = false;
          this.searchError = 'Une erreur technique s\'est produite.';
        }
      );

    }
  }

  initDefaultForms() {
    this.initSearchForm();
    this.initSearchByIdentityForm();
  }

  initDefaultIdent() {
    this.websiteForm.disable();
    this.showErrors = false;
    this.companySearchByUrlResults = undefined;
    this.initDefaultForms();
    this.rendererService.scrollToElement(this.searchKind.nativeElement);
  }

  changeWebsite() {
    this.websiteForm.enable();
    this.showErrors = false;
    this.searchForm = undefined;
    this.searchByIdentityForm = undefined;
    this.identificationKind = IdentificationKinds.Url;
    this.initSearchByUrl();
  }

  selectCompany(companySearchResult: CompanySearchResult) {
    this.selectedCompany = companySearchResult;
    if (this.identificationKind === IdentificationKinds.Url) {
      this.websiteForm.disable();
    }
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select, this.identificationKind);
    setTimeout(() => {
      const element = this.getIdentResultElement();
      const rect = element.getBoundingClientRect();
      if (isPlatformBrowser(this.platformId) && rect.bottom + 110 > window.innerHeight) {
        jQuery('html, body').animate({
          scrollTop: element.offsetTop + rect.height + 110 - window.innerHeight
        }, 1000, 'linear');
      }
    }, 100);
  }

  submitCompany(draftCompany?: DraftCompany) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCompany, this.identificationKind);
    this.draftReport.draftCompany = draftCompany || this.selectedCompany;
    if (this.urlCtrl) {
      this.draftReport.draftCompany.website = Object.assign(new Website(), { url: this.urlCtrl.value });
    }
    this.draftReport.vendor = this.vendorCtrl?.value;
    this.changeDraftCompany = false;
    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  searchCompanyByIdentity() {
    if (!this.searchByIdentityForm.valid) {
      this.showErrorsByIdentity = true;
    } else {
      this.initSearchByIdentity();
      this.loading = true;
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.searchByIdentity, this.identityCtrl.value);

      this.companyService.searchCompaniesByIdentity(this.identityCtrl.value).subscribe(
        companySearchResults => {
          this.loading = false;
          if (companySearchResults.length === 0) {
            this.searchByIdentityWarning = 'Aucun établissement ne correspond à la recherche.';
          } else {
            this.companySearchByIdentityResults = companySearchResults;
            this.rendererService.scrollToElement(this.identByIdentityResult.nativeElement);
          }
        },
        err => {
          this.loading = false;
          this.searchByIdentityError = 'Une erreur technique s\'est produite.';
        });
    }
  }

  changeCompany() {
    this.changeDraftCompany = true;
    this.companySearchResults = [];
    this.companySearchByIdentityResults = undefined;
    this.showErrors = false;
    this.showErrorsByIdentity = false;
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  hasErrorByIdentity(formControl: FormControl) {
    return this.showErrorsByIdentity && formControl.errors;
  }

  selectIdentificationKind(identificationKind: IdentificationKinds) {
    this.rendererService.scrollToElement(this.identSearch.nativeElement);
  }

  getIdentResultElement() {
    switch (this.identificationKind) {
      case IdentificationKinds.Url: {
        return this.identByUrlResult.nativeElement;
      }
      case IdentificationKinds.Name: {
        return this.identResult.nativeElement;
      }
      case IdentificationKinds.Identity: {
        return this.identByIdentityResult.nativeElement;
      }

    }
  }
}

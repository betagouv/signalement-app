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
import Utils, { CompanyAPITestingScope } from '../../../utils';
import { AbTestsService } from 'angular-ab-tests';

declare var jQuery: any;

export enum IdentificationKinds {
  Name = 'Name', Siret = 'Siret', None = 'None', Url = 'Url'
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
  @ViewChild('identBySiretResult')
  private identBySiretResult: ElementRef;

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

  searchBySiretForm: FormGroup;
  siretCtrl: FormControl;
  companySearchBySiretResult: CompanySearchResult;
  showErrorsBySiret: boolean;
  searchBySiretWarning: string;
  searchBySiretError: string;

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
              private renderer: Renderer2,
              private abTestsService: AbTestsService) { }

  ngOnInit() {
    this.step = Step.Company;
    this.reportStorageService.retrieveReportInProgress()
      .pipe(take(1))
      .subscribe(report => {
        if (report) {
          this.draftReport = report;
          this.checkExistingCompanyCompliance();
          if (this.draftReport.companyKind === CompanyKinds.SIRET) {
            this.initSearchBySiretForm();
            this.initSearchForm();
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

  initSearchBySiretForm() {
    this.siretCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{14}')]));
    this.searchBySiretForm = this.formBuilder.group({
      siret: this.siretCtrl,
    });
  }

  initSearch() {
    this.companySearchResults = [];
    this.searchWarning = '';
    this.searchError = '';
    this.selectedCompany = undefined;
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
      this.companyService.searchCompanies(this.searchCtrl.value, this.searchPostalCodeCtrl.value,
        this.abTestsService.getVersion(CompanyAPITestingScope)).subscribe(
        companySearchResults => {
          this.loading = false;
          if (companySearchResults.length === 0) {
            this.searchWarning = 'Aucun établissement ne correspond à la recherche.';
          } else {
            this.companySearchResults = companySearchResults;
            this.scrollToElement(this.identSearch.nativeElement);
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
            this.identWithWebsite();
          } else {
            this.companySearchByUrlResults = companySearchResults;
            this.scrollToElement(this.identByUrlResult.nativeElement);
          }
        },
        () => {
          this.loading = false;
          this.searchError = 'Une erreur technique s\'est produite.';
        }
      );

    }
  }

  identWithWebsite() {
    this.websiteForm.disable();
    this.showErrors = false;
    this.companySearchByUrlResults = undefined;
    this.initSearchForm();
    this.initSearchBySiretForm();
    this.scrollToElement(this.searchKind.nativeElement);
  }

  changeWebsite() {
    this.websiteForm.enable();
    this.showErrors = false;
    this.searchForm = undefined;
    this.searchBySiretForm = undefined;
    this.identificationKind = undefined;
    this.identificationKind = IdentificationKinds.Url;
    this.initSearchByUrl();
  }

  selectCompany() {
    if (this.identificationKind === IdentificationKinds.Url) {
      this.websiteForm.disable();
    }
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select, this.identificationKind);
    const element = this.getIdentResultElement();
    const rect = element.getBoundingClientRect();
    const submitButtonOffset = 145;
    if (isPlatformBrowser(this.platformId) && rect.bottom + submitButtonOffset > window.innerHeight) {
      jQuery('html, body').animate({
        scrollTop: element.offsetTop + rect.height + submitButtonOffset - window.innerHeight
      }, 1000, 'linear');
    }
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

  initSearchBySiret() {
    this.companySearchBySiretResult = undefined;
    this.searchBySiretWarning = '';
    this.searchBySiretError = '';
  }

  searchCompanyBySiret() {
    this.siretCtrl.setValue((this.siretCtrl.value as string).replace(/\s/g, ''));
    if (!this.searchBySiretForm.valid) {
      this.showErrorsBySiret = true;
    } else {
      this.initSearchBySiret();
      this.loading = true;
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.searchBySiret, this.siretCtrl.value);

      this.companyService.searchCompaniesBySiret(this.siretCtrl.value, this.abTestsService.getVersion(CompanyAPITestingScope)).subscribe(
      company => {
        this.loading = false;
        if (company) {
          this.companySearchBySiretResult = company;
          this.scrollToElement(this.identBySiretResult.nativeElement);
        } else {
          this.searchBySiretWarning = 'Aucun établissement ne correspond à la recherche.';
        }
      },
        () => {
          this.loading = false;
          this.searchBySiretError = 'Une erreur technique s\'est produite.';
      });
    }
  }

  changeCompany() {
    this.changeDraftCompany = true;
    this.companySearchResults = [];
    this.companySearchBySiretResult = undefined;
    this.showErrors = false;
    this.showErrorsBySiret = false;
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  hasErrorBySiret(formControl: FormControl) {
    return this.showErrorsBySiret && formControl.errors;
  }

  getRadioContainerClass(input: any, value: any) {
    return input === value ? 'selected' : '';
  }

  scrollToElement($element) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const rect = $element.getBoundingClientRect();
        if (Utils.isSmallerThanDesktop(this.platformId) && rect.height < window.innerHeight) {
          this.renderer.setStyle($element, 'margin-bottom', `${window.innerHeight - rect.height - 110}px`);
        }
        jQuery('html, body').animate({
          scrollTop: $element.offsetTop - 110
        }, 1000, 'linear');
      }, 500);
    }
  }

  getIdentResultElement() {
    switch (this.identificationKind) {
      case IdentificationKinds.Url: {
        return this.identByUrlResult.nativeElement;
      }
      case IdentificationKinds.Name: {
        return this.identResult.nativeElement;
      }
      case IdentificationKinds.Siret: {
        return this.identBySiretResult.nativeElement;
      }

    }
  }
}

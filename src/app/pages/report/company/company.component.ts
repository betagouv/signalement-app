import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { CompanySearchResult, CompanySearchResults } from '../../../model/CompanySearchResult';
import { CompanyService, MaxCompanyResult } from '../../../services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AnalyticsService,
  CompanySearchEventActions,
  CompanySearchEventNames,
  EventCategories,
  ReportEventActions,
} from '../../../services/analytics.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';
import { CompanyKinds } from '../../../model/Anomaly';
import { DraftCompany, Website } from '../../../model/Company';
import { isPlatformBrowser } from '@angular/common';
import Utils from '../../../utils';

declare var jQuery: any;

export enum IdentificationKinds {
  Name = 'Name', Siret = 'Siret', None = 'None'
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  @ViewChild('searchKind', {static: false})
  private searchKind: ElementRef;
  @ViewChild('identSearch', {static: false})
  private identSearch: ElementRef;
  @ViewChild('identResult', {static: false})
  private identResult: ElementRef;
  @ViewChild('identBySiretResult', {static: false})
  private identBySiretResult: ElementRef;

  step: Step;
  draftReport: DraftReport;
  companyKinds = CompanyKinds;

  websiteForm: FormGroup;
  urlCtrl: FormControl;

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

  selectedCompany: CompanySearchResult;

  showErrorsBySiret: boolean;
  searchBySiretWarning: string;
  searchBySiretError: string;

  loading: boolean;

  identificationKinds = IdentificationKinds;
  identificationKind: IdentificationKinds;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private companyService: CompanyService,
              private analyticsService: AnalyticsService,
              private renderer: Renderer2,
              public elementRef: ElementRef) { }

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
        Validators.pattern('^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$')
      ])
    );
    this.websiteForm = this.formBuilder.group({
      url: this.urlCtrl
    });
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
          if (companySearchResults.total === 0) {
            this.treatCaseNoResult();
          } else if (companySearchResults.total === 1) {
            this.treatCaseSingleResult(companySearchResults);
          } else if (companySearchResults.total > MaxCompanyResult) {
            this.treatCaseTooManyResults();
          } else {
            this.treatCaseSeveralResults(companySearchResults);
          }
        },
        () => {
          this.loading = false;
          this.treatCaseError();
        }
      );
    }
  }

  submitWebsiteForm() {
    if (!this.websiteForm.valid) {
      this.showErrors = true;
    } else {
      this.websiteForm.disable();
      this.showErrors = false;
      this.initSearchForm();
      this.initSearchBySiretForm();
      this.scrollToElement(this.searchKind.nativeElement);
    }
  }

  changeWebsite() {
    this.websiteForm.enable();
    this.showErrors = false;
    this.searchForm = undefined;
    this.searchBySiretForm = undefined;
    this.identificationKind = undefined;
  }

  treatCaseNoResult() {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.noResult
    );
    this.searchWarning = 'Aucun établissement ne correspond à la recherche.';
  }

  treatCaseSingleResult(companySearchResult: CompanySearchResults) {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.singleResult
    );
    this.companySearchResults = companySearchResult.companies;
    this.scrollToElement(this.identResult.nativeElement);
  }

  treatCaseTooManyResults() {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.tooManyResults
    );
    this.searchWarning = 'Il y a trop d\'établissement correspondant à la recherche.';
  }

  treatCaseSeveralResults(companySearchResults: CompanySearchResults) {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.severalResult
    );
    this.companySearchResults = companySearchResults.companies;
    this.scrollToElement(this.identResult.nativeElement);
  }

  treatCaseError() {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.error
    );
    this.searchError = 'Une erreur technique s\'est produite.';
  }

  selectCompany() {
    this.analyticsService.trackEvent(EventCategories.report, CompanySearchEventActions.select, this.identificationKind);
    const element = (this.identificationKind === IdentificationKinds.Name ? this.identResult : this.identBySiretResult).nativeElement
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
    this.draftReport.draftCompany = draftCompany || this.selectedCompany.draftCompany;
    if (this.urlCtrl) {
      this.draftReport.draftCompany.website = Object.assign(new Website(), { url: this.urlCtrl.value });
    }
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
      this.companyService.searchCompaniesBySiret(this.siretCtrl.value).subscribe(
      company => {
        this.loading = false;
        if (company) {
          this.analyticsService.trackEvent(
            EventCategories.companySearch,
            CompanySearchEventActions.searchBySiret,
            CompanySearchEventNames.singleResult
          );
          this.companySearchBySiretResult = company;
          this.scrollToElement(this.identBySiretResult.nativeElement);
        } else {
          this.analyticsService.trackEvent(
            EventCategories.companySearch,
            CompanySearchEventActions.searchBySiret,
            CompanySearchEventNames.noResult
          );
          this.searchBySiretWarning = 'Aucun établissement ne correspond à la recherche.';
        }
      },
        () => {
          this.loading = false;
          this.analyticsService.trackEvent(
            EventCategories.companySearch,
            CompanySearchEventActions.searchBySiret,
            CompanySearchEventNames.error
          );
          this.searchBySiretError = 'Une erreur technique s\'est produite.';
      });
    }
  }

  changeCompany() {
    this.draftReport.draftCompany = undefined;
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

}

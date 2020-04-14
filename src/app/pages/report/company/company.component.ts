import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';
import { take } from 'rxjs/operators';
import { CompanyKinds } from '../../../model/Anomaly';
import { Website } from '../../../model/Company';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  step: Step;
  draftReport: DraftReport;
  companyKinds = CompanyKinds;

  websiteForm: FormGroup;
  urlCtrl: FormControl;

  searchForm: FormGroup;
  searchCtrl: FormControl;
  searchPostalCodeCtrl: FormControl;
  companies: CompanySearchResult[];

  showErrors: boolean;
  searchWarning: string;
  searchError: string;

  searchBySiretForm: FormGroup;
  siretCtrl: FormControl;
  companyBySiret: CompanySearchResult;

  showErrorsBySiret: boolean;
  searchBySiretWarning: string;
  searchBySiretError: string;

  loading: boolean;

  bySiret = false;

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
    this.reportStorageService.retrieveReportInProgressFromStorage()
      .pipe(take(1))
      .subscribe(report => {
        if (report) {
          this.draftReport = report;
          if (this.draftReport.companyKind === CompanyKinds.SIRET) {
            this.initSearchForm();
            this.initSearchBySiretForm();
          } else {
            this.initWebsiteForm();
          }
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  changeNavTab() {
    this.bySiret = !this.bySiret;
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
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
    this.urlCtrl = this.formBuilder.control('', Validators.required);
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
    this.companies = [];
    this.searchWarning = '';
    this.searchError = '';
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
        companySearchResult => {
          this.loading = false;
          if (companySearchResult.total === 0) {
            this.treatCaseNoResult();
          } else if (companySearchResult.total === 1) {
            this.treatCaseSingleResult(companySearchResult);
          } else if (companySearchResult.total > MaxCompanyResult) {
            this.treatCaseTooManyResults();
          } else {
            this.treatCaseSeveralResults(companySearchResult);
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
      this.selectCompany(Object.assign(new Website(), {
        url: this.urlCtrl.value
      }));
    }
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
    this.companies = companySearchResult.companies;
  }

  treatCaseTooManyResults() {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.tooManyResults
    );
    this.searchWarning = 'Il y a trop d\'établissement correspondant à la recherche.';
  }

  treatCaseSeveralResults(companySearchResult) {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.severalResult
    );
    this.companies = companySearchResult.companies;
  }

  treatCaseError() {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.error
    );
    this.searchError = 'Une erreur technique s\'est produite.';
  }

  selectCompanyFromResults(company: CompanySearchResult) {
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select);
    this.selectCompany(company);
  }

  selectCompany(company: CompanySearchResult | Website) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCompany);
    this.draftReport.company = company;
    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  initSearchBySiret() {
    this.companyBySiret = undefined;
    this.searchBySiretWarning = '';
    this.searchBySiretError = '';
  }

  searchCompanyBySiret() {
    this.siretCtrl.setValue((this.siretCtrl.value as string).replace(/ /g, ''));
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
          this.companyBySiret = company;
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
    this.draftReport.company = undefined;
    this.companies = [];
    this.companyBySiret = undefined;
    this.showErrors = false;
    this.showErrorsBySiret = false;
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  hasErrorBySiret(formControl: FormControl) {
    return this.showErrorsBySiret && formControl.errors;
  }
}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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

enum IdentificationKinds {
  Name = 'Name', Siret = 'Siret', None = 'None'
}

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

  loading: boolean;

  identificationKinds = IdentificationKinds;
  identificationKind: IdentificationKinds;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private companyService: CompanyService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Company;
    this.reportStorageService.retrieveReportInProgressFromStorage()
      .pipe(take(1))
      .subscribe(report => {
        if (report) {
          this.draftReport = report;
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
    this.companySearchResults = [];
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
  }

  treatCaseError() {
    this.analyticsService.trackEvent(
      EventCategories.companySearch,
      CompanySearchEventActions.search,
      CompanySearchEventNames.error
    );
    this.searchError = 'Une erreur technique s\'est produite.';
  }

  selectCompanyFromResults(companySearchResult: CompanySearchResult) {
    this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.select);
    this.selectCompany(companySearchResult.draftCompany);
  }

  selectCompany(draftCompany: DraftCompany) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCompany);
    this.draftReport.draftCompany = draftCompany;
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

  getIdentificationClass(kind: IdentificationKinds) {
    return this.identificationKind ? (this.identificationKind === kind ? 'selected' : 'unselected') : '';
  }
}

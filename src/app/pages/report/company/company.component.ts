import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Company, CompanySearchResult } from '../../../model/Company';
import { CompanyService, MaxCompanyResult } from '../../../services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AnalyticsService,
  CompanyEventActions,
  CompanySearchEventNames,
  EventCategories,
  ReportEventActions,
} from '../../../services/analytics.service';
import { Report, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  step: Step;
  report: Report;

  around: boolean;

  searchForm: FormGroup;
  searchCtrl: FormControl;
  searchPostalCodeCtrl: FormControl;

  siretForm: FormGroup;
  siretCtrl: FormControl;

  companies: Company[];
  loading: boolean;
  searchWarning: string;
  searchError: string;
  loadingBySiretError: boolean;

  showErrors: boolean;

  scriptElement;

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
    this.reportStorageService.reportInProgess.subscribe(report => {
      if (report) {
        this.report = report;
        this.initSearchForm();
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  initSearchForm() {
    this.around = false;
    this.searchCtrl = this.formBuilder.control('', Validators.required);
    this.searchPostalCodeCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{5}')]));
    this.searchForm = this.formBuilder.group({
      search: this.searchCtrl,
      searchPostalCode: this.searchPostalCodeCtrl
    });
  }

  searchBySiret() {
    this.showErrors = false;
    this.siretCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{14}')]));
    this.siretForm = this.formBuilder.group({
      siret: this.siretCtrl,
    });
    this.displayLiveChat();
  }

  initSearch() {
    this.siretForm = null;
    this.companies = [];
    this.searchWarning = '';
    this.searchError = '';
  }

  isAround() {
    this.around = true;
    this.showErrors = false;
    this.initSearch();

  }

  isNotAround() {
    this.around = false;
    this.showErrors = false;
    this.initSearch();
  }

  searchCompany() {
    if (this.around) {
      this.showErrors = false;
      this.initSearch();
      this.loading = true;
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.around);
          this.companyService.getNearbyCompanies(lat, long).subscribe(
            companySearchResult => {
              this.loading = false;
              if (companySearchResult.total === 0) {
                this.treatCaseNoResult();
              } else if (companySearchResult.total === 1) {
                this.treatCaseSingleResult(companySearchResult);
              } else {
                this.treatCaseSeveralResults(companySearchResult);
              }
            },
            error => {
              this.loading = false;
              this.treatCaseError();
            }
          );
        }, (error) => {
          this.loading = false;
          this.showErrors = true;
        }, options);
      } else {
        this.loading = false;
        this.showErrors = true;
      }
    } else {
      if (!this.searchForm.valid) {
        this.showErrors = true;
      } else {
        this.initSearch();
        this.loading = true;
        this.analyticsService.trackEvent(
          EventCategories.company,
          CompanyEventActions.search,
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
          error => {
            this.loading = false;
            this.treatCaseError();
          }
        );
      }
    }
  }

  treatCaseNoResult() {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.noResult);
    this.searchWarning = 'Aucun établissement ne correspond à la recherche.';
  }

  treatCaseSingleResult(companySearchResult: CompanySearchResult) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.singleResult);
    this.companies = companySearchResult.companies;
  }

  treatCaseTooManyResults() {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.tooManyResults);
    this.searchWarning = 'Il y a trop d\'établissement correspondant à la recherche.';
  }

  treatCaseSeveralResults(companySearchResult) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.severalResult);
    this.companies = companySearchResult.companies;
  }

  treatCaseError() {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.noResult);
    this.searchError = 'Une erreur technique s\'est produite.';
  }

  selectCompanyFromResults(company: Company) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.select);
    this.selectCompany(company);
  }

  selectCompany(company: Company) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCompany);
    this.report.company = company;
    this.destroyLiveChat();
    this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  submitSiretForm() {
    this.loadingBySiretError = false;
    if (!this.siretForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.searchBySiret, this.siretCtrl.value);
      this.companyService.searchCompaniesBySiret(this.siretCtrl.value).subscribe(
      company => {
        this.loading = false;
        if (company) {
          this.destroyLiveChat();
          this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.searchBySiret, CompanySearchEventNames.singleResult);
          this.report.company = company;
          this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
          }
        } else {
          this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.searchBySiret, CompanySearchEventNames.noResult);
          this.loadingBySiretError = true;
        }
      });
    }
  }

  changeCompany() {
    this.report.company = undefined;
    this.siretForm = undefined;
    this.companies = [];
    this.showErrors = false;
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  displayLiveChat() {
    if (isPlatformBrowser(this.platformId)) {
      this.scriptElement = this.renderer.createElement('script');
      this.renderer.setAttribute(this.scriptElement, 'src', 'https://signalconso.rocket.chat/packages/rocketchat_livechat/assets/rocketchat-livechat.min.js?_=201702160944');
      this.renderer.setAttribute(this.scriptElement, 'async', 'true');
      this.renderer.appendChild(this.elementRef.nativeElement, this.scriptElement);
      window['RocketChat'] = (c => window['RocketChat']._.push(c));
      window['RocketChat']._ = [];
      window['RocketChat'].url = 'https://signalconso.rocket.chat/livechat';
    }
  }

  destroyLiveChat() {
    if (isPlatformBrowser(this.platformId) && this.scriptElement) {
      document.getElementsByClassName('rocketchat-widget')[0].remove();
      this.renderer.removeChild(this.elementRef.nativeElement, this.scriptElement);
    }
  }
}

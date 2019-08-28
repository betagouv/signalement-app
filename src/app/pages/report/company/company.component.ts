import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  step: Step;
  report: Report;

  searchForm: FormGroup;
  searchCtrl: FormControl;
  searchPostalCodeCtrl: FormControl;
  companies: Company[];

  showErrors: boolean;
  searchWarning: string;
  searchError: string;

  searchBySiretForm: FormGroup;
  siretCtrl: FormControl;
  companyBySiret: Company;

  showErrorsBySiret: boolean;
  searchBySiretWarning: string;
  searchBySiretError: string;

  loading: boolean;

  bySiret = false;

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
    this.reportStorageService.reportInProgess
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(report => {
        if (report) {
          this.report = report;
          this.initSearchForm();
          this.initSearchBySiretForm();
          if (!this.report.company) {
            this.displayLiveChat();
          }
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });

      const elt = document.querySelector("#searchForm");
      if (elt && elt instanceof HTMLElement) {
        elt.focus();
      }

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.hideLiveChat();
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
        () => {
          this.loading = false;
          this.treatCaseError();
        }
      );
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
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.error);
    this.searchError = 'Une erreur technique s\'est produite.';
  }

  selectCompanyFromResults(company: Company) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.select);
    this.selectCompany(company);
  }

  selectCompany(company: Company) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCompany);
    this.report.company = company;
    this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
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
      this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.searchBySiret, this.siretCtrl.value);
      this.companyService.searchCompaniesBySiret(this.siretCtrl.value).subscribe(
      company => {
        this.loading = false;
        if (company) {
          this.analyticsService.trackEvent(
            EventCategories.company,
            CompanyEventActions.searchBySiret,
            CompanySearchEventNames.singleResult
          );
          this.companyBySiret = company;
        } else {
          this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.searchBySiret, CompanySearchEventNames.noResult);
          this.searchBySiretWarning = 'Aucun établissement ne correspond à la recherche.';
        }
      },
        () => {
          this.loading = false;
          this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.searchBySiret, CompanySearchEventNames.error);
          this.searchBySiretError = 'Une erreur technique s\'est produite.';
      });
    }
  }

  changeCompany() {
    this.report.company = undefined;
    this.companies = [];
    this.companyBySiret = undefined;
    this.showErrors = false;
    this.showErrorsBySiret = false;
    this.displayLiveChat();

    setTimeout(() => {
      const elt = document.querySelector("#firstTab");

      if (elt && elt instanceof HTMLElement) {
        elt.focus();
      } else {
        console.error("firstTab non trouvé pour le focus")
      }
    });
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  hasErrorBySiret(formControl: FormControl) {
    return this.showErrorsBySiret && formControl.errors;
  }

  displayLiveChat() {
    if (isPlatformBrowser(this.platformId)) {
      const rocketChatElement = document.getElementsByClassName('rocketchat-widget');
      if (rocketChatElement && rocketChatElement.length) {
        this.renderer.removeClass(rocketChatElement[0], 'd-none');
      } else {
        this.createLiveChat();
      }
    }
  }

  createLiveChat() {
    if (isPlatformBrowser(this.platformId)) {
      this.scriptElement = this.renderer.createElement('script');
      this.renderer.setAttribute(
        this.scriptElement,
        'src',
        'https://signalconso.rocket.chat/packages/rocketchat_livechat/assets/rocketchat-livechat.min.js?_=201702160944'
      );
      this.renderer.setAttribute(this.scriptElement, 'async', 'true');
      this.renderer.appendChild(this.elementRef.nativeElement, this.scriptElement);
      window['RocketChat'] = (c => window['RocketChat']._.push(c));
      window['RocketChat']._ = [];
      window['RocketChat'].url = 'https://signalconso.rocket.chat/livechat';
    }
  }

  hideLiveChat() {
    if (isPlatformBrowser(this.platformId)) {
      const rocketChatElement = document.getElementsByClassName('rocketchat-widget');
      if (rocketChatElement && rocketChatElement.length) {
        this.renderer.addClass(rocketChatElement[0], 'd-none');
      }
    }
  }
}

import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef } from '@angular/core';
import { NbReportsGroupByCompany } from '../../../model/NbReportsGroupByCompany';
import { isPlatformBrowser, Location } from '@angular/common';
import { Roles, User } from '../../../model/AuthUser';
import { ReportService } from '../../../services/report.service';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompaniesService, MaxCompanyResult } from '../../../services/company.service';
import { CompanySearchResult, CompanyToActivate } from '../../../model/Company';
import { AuthenticationService } from '../../../services/authentication.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { differenceInMilliseconds, isSameDay } from 'date-fns';

@Component({
  selector: 'app-companies-admin',
  templateUrl: './companies-admin.component.html',
  styleUrls: ['./companies-admin.component.scss']
})
export class CompaniesAdminComponent implements OnInit {

  readonly searchTab = {link: ['/', 'entreprises', 'recherche'], label: 'Recherche'};
  readonly mostReportedTab = {link: ['/', 'entreprises', 'les-plus-signalees'], label: 'Les plus signalées'};
  readonly toActivateTab = {link: ['/', 'entreprises', 'a-activer'], label: 'En attente d\'activation'};

  navTabs?: {link: string[], label: string}[];
  currentNavTab?: {link: string[], label: string};

  readonly searchCtrl = new FormControl('', Validators.required);

  maxCompanyResult = MaxCompanyResult;

  user?: User;
  roles = Roles;
  totalCount?: number;
  currentPage?: number;
  itemsPerPage = 20;
  lines?: NbReportsGroupByCompany[];
  companiesToActivate?: CompanyToActivate[];
  allCompaniesToActivate?: CompanyToActivate[];

  showErrors = false;
  loading = false;
  loadingError = false;
  companyCreationSucceed = false;

  checkedCompaniesUuids = new Set<string>();
  modalRef?: BsModalRef;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private location: Location,
              private authenticationService: AuthenticationService,
              private companyAccessesService: CompanyAccessesService,
              private localeService: BsLocaleService,
              private reportService: ReportService,
              public companyService: CompaniesService,
              private modalService: BsModalService,
              private route: ActivatedRoute
  ) { }

  ngOnInit() {
    combineLatest([this.route.url, this.authenticationService.user]).pipe(take(1))
      // @ts-ignore TODO check why user is of type unknown
      .subscribe(([url, user]: [UrlSegment[], User]) => {
        if (user && (user.role === this.roles.Admin || user.role === this.roles.DGCCRF)) {
          this.user = user;
          this.navTabs = {
            [this.roles.Admin]: [this.searchTab, this.mostReportedTab, this.toActivateTab],
            [this.roles.DGCCRF]: [this.mostReportedTab]
          }[user.role];
          this.currentNavTab = this.navTabs.find(tab =>
            tab.link.reduce((s1, s2) => `${s1}/${s2}`) === url.reduce((s, segment) => `${s}/${segment.toString()}`, '/')
          );

          if (!this.currentNavTab) {
            this.currentNavTab = this.navTabs[0];
          }

          ({
            [this.searchTab.label]: () => this.bindFormToQueryString(),
            [this.mostReportedTab.label]: () => this.loadReports(1),
            [this.toActivateTab.label]: () => this.loadCompaniesToActivate()
          }[this.currentNavTab.label])();
        }
      });
  }

  bindFormToQueryString() {
    this.route.queryParams.subscribe(
      queryParams => {
        if (queryParams && queryParams['q']) {
          this.searchCtrl.setValue(queryParams['q']);
          this.searchCompanies();
        }
      }
    );
  }

  searchCompanies() {
    if (RegExp(/^[0-9\s]+$/g).test(this.searchCtrl.value)) {
      this.searchCtrl.setValue((this.searchCtrl.value as string).replace(/\s/g, ''));
    }
    this.location.go('entreprises/recherche', `q=${this.searchCtrl.value}`);
    this.companyService.list({ clean: true }, this.searchCtrl.value).subscribe();
  }

  loadReports(page: number) {
    this.loading = true;
    this.loadingError = false;

    this.reportService.getNbReportsGroupByCompany(
      (page - 1) * this.itemsPerPage,
      this.itemsPerPage).subscribe(
        result => {
          this.loading = false;

          this.totalCount = result.totalCount;
          this.currentPage = page;

          this.lines = result.entities || [];
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
  }

  checkCompany(uuid: string) {
    if (this.checkedCompaniesUuids.has(uuid)) {
      this.checkedCompaniesUuids.delete(uuid);
    } else {
      this.checkedCompaniesUuids.add(uuid);
    }
  }

  checkAllCompanies() {
    if (this.companiesToActivate?.length === this.checkedCompaniesUuids.size) {
      this.checkedCompaniesUuids.clear();
    } else {
      this.checkedCompaniesUuids = new Set(this.companiesToActivate?.map(toActivate => toActivate.company.id));
    }
  }

  loadCompaniesToActivate() {
    this.loading = true;
    this.loadingError = false;

    this.companyAccessesService.companiesToActivate().subscribe(
      result => {
        this.loading = false;
        this.allCompaniesToActivate = result.sort((c1, c2) => {
          if (isSameDay(c1.tokenCreation, c2.tokenCreation) && c1.lastNotice) {
            return c2.lastNotice ? differenceInMilliseconds(c2.lastNotice, c1.lastNotice) : 1;
          } else {
            return differenceInMilliseconds(c2.tokenCreation, c1.tokenCreation);
          }
        });
        this.companiesToActivate = this.allCompaniesToActivate;
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      }
    );
  }

  downloadActivationDocuments() {
    if (isPlatformBrowser(this.platformId)) {
      this.companyAccessesService.downloadActivationDocuments(this.checkedCompaniesUuids).subscribe(response => {
        const blob = new Blob([(response as unknown as HttpResponse<Blob>).body!], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'courriers.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  confirmLettersSending() {
    this.loading = true;
    this.loadingError = false;
    this.companyAccessesService.confirmContactByPostOnCompaniesList(this.checkedCompaniesUuids).subscribe(
      events => {
        this.loading = false;
        this.modalRef?.hide();
        this.loadCompaniesToActivate();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  changePage(pageEvent: { page: number, itemsPerPage: number }) {
    if (this.currentPage !== pageEvent.page) {
      this.loadReports(pageEvent.page);
      this.location.go('entreprises/les-plus-signalees', `page_number=${pageEvent.page}`);
    }
  }

  previousTab() {
    this.currentNavTab = this.navTabs?.[this.navTabs.indexOf(this.currentNavTab!) - 1];
  }

  nextTab() {
    this.currentNavTab = this.navTabs?.[this.navTabs.indexOf(this.currentNavTab!) + 1];
  }

  readonly createCompany = (company: CompanySearchResult) => {
    this.companyCreationSucceed = false;
    const { siret, name, address, postalCode, activityCode } = company;
    this.companyService
      .create({ siret, name, address, postalCode, activityCode }, { insert: false })
      .subscribe(() => this.companyCreationSucceed = true);
  };
}

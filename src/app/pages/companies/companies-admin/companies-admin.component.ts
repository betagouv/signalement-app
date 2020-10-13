import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NbReportsGroupByCompany } from '../../../model/NbReportsGroupByCompany';
import { isPlatformBrowser, Location } from '@angular/common';
import pages from '../../../../assets/data/pages.json';
import { Roles, User } from '../../../model/AuthUser';
import { ReportService } from '../../../services/report.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService, MaxCompanyResult } from '../../../services/company.service';
import { Company, CompanyToActivate, UserAccess } from '../../../model/Company';
import { AuthenticationService } from '../../../services/authentication.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import * as lodash from 'lodash';
import { HttpResponse } from '@angular/common/http';
import { BsLocaleService, BsModalRef, BsModalService } from 'ngx-bootstrap';
import moment from 'moment';

@Component({
  selector: 'app-companies-admin',
  templateUrl: './companies-admin.component.html',
  styleUrls: ['./companies-admin.component.scss']
})
export class CompaniesAdminComponent implements OnInit {

  searchTab = {link: ['/', 'entreprises', 'recherche'], label: 'Recherche'};
  mostReportedTab = {link: ['/', 'entreprises', 'les-plus-signalees'], label: 'Les plus signalées'};
  toActivateTab = {link: ['/', 'entreprises', 'a-activer'], label: 'En attente d\'activation'};

  navTabs: {link: string[], label: string}[];
  currentNavTab: {link: string[], label: string};

  searchForm: FormGroup;
  searchCtrl: FormControl;
  companies: Company[];
  maxCompanyResult = MaxCompanyResult;

  user: User;
  roles = Roles;
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;
  lines: NbReportsGroupByCompany[];
  companiesToActivate: CompanyToActivate[];
  allCompaniesToActivate: CompanyToActivate[];

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;

  checkedCompaniesUuids = new Set<string>();
  modalRef: BsModalRef;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private location: Location,
              private authenticationService: AuthenticationService,
              private companyAccessesService: CompanyAccessesService,
              private localeService: BsLocaleService,
              private reportService: ReportService,
              private companyService: CompanyService,
              private modalService: BsModalService,
              private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.localeService.use('fr');

    this.titleService.setTitle(pages.companies.companiesAdmin.title);
    this.meta.updateTag({ name: 'description', content: pages.companies.companiesAdmin.description });

    combineLatest([this.route.url, this.authenticationService.user]).pipe(take(1))
      .subscribe(([url, user]) => {
        this.user = user;
        this.navTabs = {
          [this.roles.Admin]: [this.searchTab, this.mostReportedTab, this.toActivateTab],
          [this.roles.DGCCRF]: [this.mostReportedTab]
        }[user.role];
        this.currentNavTab = this.navTabs.find(
          tab => lodash.isEqual(tab.link.slice(1), url.slice(0, 2).map(segment => segment.toString()))
        );
        if (!this.currentNavTab) {
          this.currentNavTab = this.navTabs[0];
        }

        ({
          [this.searchTab.label]: () => this.initSearchForm(),
          [this.mostReportedTab.label]: () => this.loadReports(1),
          [this.toActivateTab.label]: () => this.loadCompaniesToActivate()
        }[this.currentNavTab.label])();
      });

  }

  initSearchForm() {
    this.searchCtrl = this.formBuilder.control('', Validators.required);

    this.searchForm = this.formBuilder.group({
      search: this.searchCtrl
    });

    this.route.queryParams.subscribe(
      queryParams => {
        if (queryParams && queryParams['q']) {
          this.searchCtrl.setValue(queryParams['q']);
          this.submitSearchForm();
        }
      }
    );
  }

  submitSearchForm() {
    this.loading = true;
    this.loadingError = false;
    this.companies = undefined;
    if (RegExp(/^[0-9\s]+$/g).test(this.searchCtrl.value)) {
      this.searchCtrl.setValue((this.searchCtrl.value as string).replace(/\s/g, ''));
    }
    this.location.go('entreprises/recherche', `q=${this.searchCtrl.value}`);
    this.companyService.searchRegisterCompanies(this.searchCtrl.value).subscribe(
      result => {
        this.loading = false;
        this.companies = result;
      },
      error => {
        this.loadingError = true;
        this.loading = false;
      }
    );
  }

  companyToUserAccess(company: Company) {
    return <UserAccess> {
      companySiret: company.siret,
      companyName: company.name,
      companyAddress: company.address,
      level: 'admin'
    };
  }

  onCompanyChange(company: Company, companyIndex: number) {
    this.companies.splice(companyIndex, 1, company);
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
    if (this.companiesToActivate.length === this.checkedCompaniesUuids.size) {
      this.checkedCompaniesUuids.clear();
    } else {
      this.checkedCompaniesUuids = new Set(this.companiesToActivate.map(toActivate => toActivate.company.id));
    }
  }

  loadCompaniesToActivate() {
    this.loading = true;
    this.loadingError = false;

    this.companyAccessesService.companiesToActivate().subscribe(
      result => {
        this.loading = false;
        this.allCompaniesToActivate = result.sort((c1, c2) => {
          if (moment(c1.tokenCreation).isSame(c2.tokenCreation, 'day') && c1.lastNotice) {
            return c2.lastNotice ? moment(c2.lastNotice).diff(c1.lastNotice) : 1;
          } else {
            return moment(c2.tokenCreation).diff(c1.tokenCreation);
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
        const blob = new Blob([(response as HttpResponse<Blob>).body], { type: 'application/pdf' });
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
        this.modalRef.hide();
        this.loadCompaniesToActivate();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  changePage(pageEvent: { page: number, itemPerPage: number }) {
    if (this.currentPage !== pageEvent.page) {
      this.loadReports(pageEvent.page);
      this.location.go('entreprises/les-plus-signalees', `page_number=${pageEvent.page}`);
    }
  }

  previousTab() {
    this.currentNavTab = this.navTabs[this.navTabs.indexOf(this.currentNavTab) - 1];
  }

  nextTab() {
    this.currentNavTab = this.navTabs[this.navTabs.indexOf(this.currentNavTab) + 1];
  }
}

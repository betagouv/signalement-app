import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NbReportsGroupByCompany } from '../../../model/NbReportsGroupByCompany';
import { Location } from '@angular/common';
import pages from '../../../../assets/data/pages.json';
import { Roles } from '../../../model/AuthUser';
import { ReportService } from '../../../services/report.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService, MaxCompanyResult } from '../../../services/company.service';
import { Company } from '../../../model/Company';
import { UserAccess } from '../../../model/CompanyAccess';
import { AuthenticationService } from '../../../services/authentication.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import * as lodash from 'lodash';

@Component({
  selector: 'app-companies-admin',
  templateUrl: './companies-admin.component.html',
  styleUrls: ['./companies-admin.component.scss']
})
export class CompaniesAdminComponent implements OnInit {

  searchTab = {link: ['/', 'entreprises', 'recherche'], label: 'Recherche'};
  mostReportedTab = {link: ['/', 'entreprises', 'les-plus-signalees'], label: 'Les plus signalées'};

  navTabs: {link: string[], label: string}[];
  currentNavTab: {link: string[], label: string}

  searchForm: FormGroup;
  searchCtrl: FormControl;
  companies: Company[];
  maxCompanyResult = MaxCompanyResult;

  roles = Roles;
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;
  lines: NbReportsGroupByCompany[];

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private location: Location,
              private authenticationService: AuthenticationService,
              private reportService: ReportService,
              private companyService: CompanyService,
              private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.titleService.setTitle(pages.companies.companiesAdmin.title);
    this.meta.updateTag({ name: 'description', content: pages.companies.companiesAdmin.description });

    combineLatest([this.route.url, this.authenticationService.user]).pipe(take(1))
      .subscribe(([url, user]) => {
        this.navTabs = {
          [this.roles.Admin]: [this.searchTab, this.mostReportedTab],
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
          [this.mostReportedTab.label]: () => this.loadReports(1)
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

  changePage(pageEvent: { page: number, itemPerPage: number }) {
    if (this.currentPage !== pageEvent.page) {
      this.loadReports(pageEvent.page);
      this.location.go('entreprises/les-plus-signalees', `page_number=${pageEvent.page}`);
    }
  }
}

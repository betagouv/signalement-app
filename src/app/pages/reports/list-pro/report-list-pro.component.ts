import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserAccess } from '../../../model/Company';
import { Report, ReportStatus, reportStatusColor } from '../../../model/Report';
import { ReportFilter } from '../../../model/ReportFilter';
import { combineLatest } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import { ReportService } from '../../../services/report.service';
import { ConstantService } from '../../../services/constant.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { mergeMap, take } from 'rxjs/operators';
import pages from '../../../../assets/data/pages.json';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-report-list-pro',
  templateUrl: './report-list-pro.component.html',
  styleUrls: ['./report-list-pro.component.scss']
})
export class ReportListProComponent implements OnInit {

  reportStatus = ReportStatus;
  statusColor = reportStatusColor;

  userAccesses: UserAccess[];
  reports: Report[];
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;

  reportFilter: ReportFilter;
  statusList: string[];

  loading: boolean;
  loadingError: boolean;
  withFiltering: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private reportService: ReportService,
              private constantService: ConstantService,
              private companyAccessesService: CompanyAccessesService,
              private localeService: BsLocaleService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.titleService.setTitle(pages.reports.list.title);
    this.meta.updateTag({ name: 'description', content: pages.reports.list.description });
    this.localeService.use('fr');

    const queryParamMap = this.route.snapshot.queryParamMap;
    const paramMap = this.route.snapshot.paramMap;

    this.constantService.getReportStatusList().subscribe(
      statusList => this.statusList = statusList
    );

    this.reportFilter = this.reportService.currentReportFilter;
    this.reportFilter.siret = paramMap.get('siret');

    this.loading = true;
    this.loadingError = false;
    this.authenticationService.user.pipe(
      take(1),
      mergeMap(user => {
        return combineLatest([
          this.companyAccessesService.myAccesses(user)
        ]);
      })
    ).subscribe(
      ([userAccesses]) => {

        this.userAccesses = userAccesses;

        if (this.userAccesses.length === 1 || this.reportFilter.siret) {
          this.loadReports(Number(queryParamMap.get('page_number') || 1));
        } else {
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  initPagination() {
    this.totalCount = 0;
    this.currentPage = 1;
  }

  submitFilters() {
    this.location.replaceState(this.router.routerState.snapshot.url.split('?')[0], `page_number=1&per_page=${this.itemsPerPage}`);
    this.initPagination();
    this.reportFilter.siret = this.reportFilter.siret?.replace(/\s/g, '');
    this.loadReports(1);
    this.withFiltering = true;
  }

  cancelFilters() {
    this.reportFilter = { siret: this.reportFilter.siret };
    this.submitFilters();
  }

  loadReports(page: number) {
    this.loading = true;
    this.loadingError = false;
    this.reportService.getReports({
      ...this.reportFilter,
      offset: (page - 1) * this.itemsPerPage,
      limit: this.itemsPerPage,
    }).subscribe(
      result => {
        this.loading = false;
        this.reports = result.entities;
        this.totalCount = result.totalCount;
        setTimeout(() => {
          this.currentPage = page;
        }, 1);
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  changePage(pageEvent: {page: number, itemPerPage: number}) {
    if (this.currentPage !== pageEvent.page) {
      this.loadReports(pageEvent.page);
      this.location.go('suivi-des-signalements/pro', `page_number=${pageEvent.page}&per_page=${this.itemsPerPage}`);
    }
  }

  launchExtraction() {
    this.reportService.launchExtraction(this.reportFilter).subscribe(res => {
      this.router.navigate(['mes-telechargements']);
    });
  }

  isFirstVisit() {
    return this.reports && this.reports.length === 1 && this.reports[0].status === ReportStatus.UnreadForPro;
  }

  withPagingAndFiltering() {
    return this.totalCount > 10 || this.withFiltering;
  }

  hasFilter() {
    return this.reportFilter && (this.reportFilter.period || this.reportFilter.status);
  }
}

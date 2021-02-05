import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Report, ReportStatus } from '../../../model/Report';
import { ReportFilter } from '../../../model/ReportFilter';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import { ReportService } from '../../../services/report.service';
import { ConstantService } from '../../../services/constant.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import pages from '../../../../assets/data/pages.json';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-report-list-pro',
  templateUrl: './report-list-pro.component.html',
  styleUrls: ['./report-list-pro.component.scss']
})
export class ReportListProComponent implements OnInit {

  readonly displayedColumns = [
    'creationDate',
    'consumerUploadedFiles',
    'status',
    'consumer',
  ];

  readonly reportStatus = ReportStatus;

  reports?: Report[];

  totalCount?: number;

  currentPage?: number;

  itemsPerPage = 20;

  reportFilter?: ReportFilter;
  readonly statusList$ = this.constantService.getReportStatusList();

  loading = false;
  loadingError = false;
  withFiltering = false;

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

    this.reportFilter = this.reportService.currentReportFilter;
    this.reportFilter.siret = paramMap.get('siret') ?? queryParamMap.get('siret') ?? undefined;

    this.loadReports(+(queryParamMap.get('page_number') || '1'));
  }

  initPagination() {
    this.totalCount = 0;
    this.currentPage = 1;
  }

  submitFilters() {
    this.location.replaceState(this.router.routerState.snapshot.url.split('?')[0], `page_number=1&per_page=${this.itemsPerPage}`);
    this.initPagination();
    if (this.reportFilter) {
      this.reportFilter.siret = this.reportFilter.siret?.replace(/\s/g, '');
    }
    this.loadReports(1);
    this.withFiltering = true;
  }

  cancelFilters() {
    this.reportFilter = { siret: this.reportFilter?.siret };
    this.submitFilters();
  }

  loadReports(page: number) {
    this.loading = true;
    this.loadingError = false;
    this.reportService.getReports({
      ...this.reportFilter,
      offset: (page - 1) * this.itemsPerPage,
      limit: this.itemsPerPage,
    }).subscribe(result => {
      console.log(result);
      this.loading = false;
      this.reports = result.entities;
      this.totalCount = result.totalCount;
      this.currentPage = page;
    }, err => {
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
    if (this.reportFilter) {
      this.reportService.launchExtraction(this.reportFilter).subscribe(res => {
        this.router.navigate(['mes-telechargements']);
      });
    }
  }

  isFirstVisit() {
    return this.reports && this.reports.length === 1 && this.reports[0].status === ReportStatus.UnreadForPro;
  }

  withPagingAndFiltering() {
    return this.totalCount && this.totalCount > 0 || this.withFiltering;
  }

  hasFilter() {
    return this.reportFilter && (this.reportFilter.start || this.reportFilter.end || this.reportFilter.status);
  }
}

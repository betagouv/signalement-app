import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Report, ReportStatus } from '../../../model/Report';
import { ReportFilter, reportFilter2QueryString, reportFilterFromQueryString } from '../../../model/ReportFilter';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import { ReportService } from '../../../services/report.service';
import { ConstantService } from '../../../services/constant.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute, Router } from '@angular/router';
import pages from '../../../../assets/data/pages.json';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatedData } from '../../../model/PaginatedData';
import Utils from '../../../utils';
import { UserAccess } from '../../../model/Company';

type ReportFiltersPro = Pick<ReportFilter, 'start' | 'end' | 'siret' | 'status' | 'offset' | 'limit'>;

@Component({
  selector: 'app-report-list-pro',
  templateUrl: './report-list-pro.component.html',
  styleUrls: ['./report-list-pro.component.scss']
})
export class ReportListProComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
    private titleService: Title,
    private meta: Meta,
    private authenticationService: AuthenticationService,
    private reportService: ReportService,
    private constantService: ConstantService,
    private companyAccessesService: CompanyAccessesService,
    private localeService: BsLocaleService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  readonly columns = [
    'siret',
    'creationDate',
    'consumerUploadedFiles',
    'status',
    'consumer',
  ];

  readonly defaultPageSize = 10;

  readonly maxReportsBeforeShowFilters = 9;

  readonly startCtrl = new FormControl('');
  readonly endCtrl = new FormControl('');
  readonly siretCtrl = new FormControl('');
  readonly statusCtrl = new FormControl('');
  readonly offsetCtrl = new FormControl(0);
  readonly limitCtrl = new FormControl(10);
  readonly form = new FormGroup({
    start: this.startCtrl,
    end: this.endCtrl,
    siret: this.siretCtrl,
    status: this.statusCtrl,
    offset: this.offsetCtrl,
    limit: this.limitCtrl,
  });

  readonly reportStatus = ReportStatus;

  showFilters = false;

  reports?: Report[];

  totalCount?: number;

  readonly statusList$ = this.constantService.getReportStatusList();

  readonly companies$ = this.authenticationService.user.pipe(mergeMap(this.companyAccessesService.myAccesses));

  companies?: UserAccess[];

  loading = false;

  loadingError = false;

  ngOnInit() {
    this.titleService.setTitle(pages.reports.list.title);
    this.meta.updateTag({ name: 'description', content: pages.reports.list.description });
    this.localeService.use('fr');

    const initialValues = this.getFormFromQueryString(reportFilterFromQueryString(this.route.snapshot.queryParams));

    console.log(this.route.snapshot.queryParams);
    console.log(this.getFormFromQueryString(reportFilterFromQueryString(this.route.snapshot.queryParams)));
    this.companies$.subscribe(_ => this.companies = _);

    this.initForm(initialValues).valueChanges.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(this.updateQueryString)
    ).subscribe(this.fetchReports);

    this.fetchReports(this.form.value).then(() => {
      this.showFilters = this.reports.length > this.maxReportsBeforeShowFilters || this.hasFilters();
    });
  }

  readonly getDisplayedColumns = this.companies$.pipe(map(companies => companies.length > 1
    ? this.columns
    : this.columns.filter(_ => _ !== 'siret')
  ));

  readonly fetchReports = async (filters: ReportFiltersPro) => {
    this.loading = true;
    this.loadingError = false;
    await this.reportService.getReports(filters).toPromise().then((result: PaginatedData<Report>) => {
      this.loading = false;
      this.reports = result.entities;
      this.totalCount = result.totalCount;
    }).catch(err => {
      this.loading = false;
      this.loadingError = true;
      throw err;
    });
  };

  readonly getFormFromQueryString = (qs: ReportFiltersPro): ReportFiltersPro => {
    try {
      const { start, end, siret, status, offset, limit } = qs;
      return { start, end, siret, status, offset: offset ?? 0, limit: limit ?? this.defaultPageSize, };
    } catch (e) {
      console.error('Caught error on "reportFilterFromQueryString"', qs, e);
      return {};
    }
  };

  readonly initForm = (filters: ReportFilter): FormGroup => {
    const cleanedFilters = Utils.cleanObject(filters);
    this.form.patchValue(cleanedFilters);
    return this.form;
  };

  readonly changePage = ($event: PageEvent) => {
    this.form.patchValue({
      offset: $event.pageIndex * $event.pageSize,
      limit: $event.pageSize,
    });
  };

  readonly launchExtraction = () => {
    this.reportService.launchExtraction(this.form.value).subscribe(res => {
      this.router.navigate(['mes-telechargements']);
    });
  };

  private updateQueryString = (values: ReportFiltersPro) => {
    this.router.navigate([], { queryParams: reportFilter2QueryString(values), replaceUrl: true });
  };

  readonly isFirstVisit = () => this.reports?.length === 1 && this.reports[0].status === ReportStatus.UnreadForPro;

  readonly hasFilters = () => {
    const { limit, offset, ...values } = this.form.value;
    return !Object.values(values).every(_ => _ === '' || _ === undefined || _ === null);
  };
}

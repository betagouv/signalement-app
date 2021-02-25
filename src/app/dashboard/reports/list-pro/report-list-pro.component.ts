import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Report, ReportStatus } from '../../../model/Report';
import { ReportFilter, reportFilter2QueryString, reportFilterFromQueryString } from '../../../model/ReportFilter';
import { Meta, Title } from '@angular/platform-browser';
import { ReportService } from '../../../services/report.service';
import { ConstantService } from '../../../services/constant.service';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute, Router } from '@angular/router';
import pages from '../../../../assets/data/pages.json';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PageEvent } from '@angular/material/paginator';
import { catchError, debounceTime, distinctUntilChanged, map, mergeMap, shareReplay, startWith, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatedData } from '../../../model/PaginatedData';
import Utils from '../../../utils';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { ViewableCompany } from '../../../model/Company';

type ReportFiltersPro = Pick<ReportFilter, 'start' | 'end' | 'siretSirenList' | 'status' | 'offset' | 'limit'>;

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
    private reportService: ReportService,
    private constantService: ConstantService,
    private companyAccessesService: CompanyAccessesService,
    private localeService: BsLocaleService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  readonly columns = [
    'postalCode',
    'siret',
    'creationDate',
    'consumerUploadedFiles',
    'status',
    'consumer',
    'actions',
  ];

  readonly isMobileSize = () => window.innerWidth < 600;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobileMode = this.isMobileSize();
  }

  mobileMode = this.isMobileSize();

  /** @todo Can be removed once it's outdated */
  readonly showNewFeatureIndicator = new Date().getTime() < new Date(2021, 3, 1).getTime();

  readonly maxReportsBeforeShowFilters = 10;

  readonly defaultPageSize = this.maxReportsBeforeShowFilters;

  readonly pagesOptions = [this.maxReportsBeforeShowFilters, this.maxReportsBeforeShowFilters * 2, this.maxReportsBeforeShowFilters * 10];

  readonly startCtrl = new FormControl('');
  readonly endCtrl = new FormControl('');
  readonly departmentsCtrl = new FormControl([]);
  readonly siretSirenListCtrl = new FormControl([]);
  readonly statusCtrl = new FormControl('');
  readonly offsetCtrl = new FormControl(0);
  readonly limitCtrl = new FormControl(this.defaultPageSize);
  readonly form = new FormGroup({
    start: this.startCtrl,
    end: this.endCtrl,
    departments: this.departmentsCtrl,
    siretSirenList: this.siretSirenListCtrl,
    status: this.statusCtrl,
    offset: this.offsetCtrl,
    limit: this.limitCtrl,
  });

  readonly reportStatus = ReportStatus;

  showFilters = false;

  reports?: Report[];

  totalCount?: number;

  readonly statusList$ = this.constantService.getReportStatusList();

  loadingCompanies = false;

  readonly myCompanies$ = this.companyAccessesService.myAccesses();

  readonly companies$: Observable<ViewableCompany[]> = new Observable(_ => _.next()).pipe(
    tap(() => {
      this.loadingCompanies = true;
    }),
    mergeMap(() => this.companyAccessesService.viewableCompanies()),
    tap(() => {
      this.loadingCompanies = false;
    }),
    shareReplay(),
    catchError(err => {
      this.loadingCompanies = false;
      this.loadingAccessError = true;
      return [];
    })
  );

  loading = false;

  loadingError = false;

  loadingAccessError = false;

  readonly hasCompanies$ = this.companies$.pipe(map(_ => _.length > 0));

  readonly hasMultiplesCompanies$ = this.companies$.pipe(map(_ => _.length > 1));

  readonly companiesBySelectedDepartments$ = combineLatest([
    this.departmentsCtrl.valueChanges.pipe(startWith([]), map(_ => _ || [])) as Observable<string[]>,
    this.companies$
  ]).pipe(map(([departments, companies]) => departments.length > 0
    ? companies.filter(company => departments.find(_ => _ === company.postalCode.substr(0, 2)))
    : companies
  ));

  readonly getDisplayedColumns = this.hasMultiplesCompanies$.pipe(map(hasMultiple => hasMultiple
    ? this.columns
    : this.columns.filter(_ => _ !== 'siret' && _ !== 'postalCode')));

  ngOnInit() {
    this.titleService.setTitle(pages.reports.list.title);
    this.meta.updateTag({ name: 'description', content: pages.reports.list.description });
    this.localeService.use('fr');

    const initialValues = {
      offset: 0,
      limit: this.defaultPageSize,
      ...this.getFormFromQueryString(reportFilterFromQueryString(this.route.snapshot.queryParams)),
    };

    this.myCompanies$
      .pipe(
        mergeMap(myCompanies => this.initForm({ ...initialValues, siretSirenList: myCompanies.map(_ => _.companySiret) }).valueChanges),
        debounceTime(10),
        distinctUntilChanged(),
        tap(this.updateQueryString),
        mergeMap(this.fetchReports),
      ).subscribe();

    this.hasCompanies$.pipe(mergeMap(hasCompanies => {
      if (!hasCompanies) {
        return EMPTY;
      }
      return this.fetchReports(this.form.value).pipe(tap(() => {
        this.showFilters = this.totalCount > this.maxReportsBeforeShowFilters || this.hasFilters();
      }));
    })).subscribe();
  }

  readonly checkBoxStatus$ = (companies$: Observable<any[]>) => combineLatest([
    this.siretSirenListCtrl.valueChanges.pipe(map(_ => _ || [])) as Observable<string[]>,
    companies$
  ])
    .pipe(map(([values, companies]) => {
      if (values.length === companies.length) {
        return 'checked';
      }
      if (values.length === 0) {
        return 'unchecked';
      }
      return 'indeterminate';
    }));

  readonly allSiretCheckboxStatus$ = this.checkBoxStatus$(this.companies$);

  readonly allMyAccessesCheckboxStatus$ = this.checkBoxStatus$(this.myCompanies$);

  readonly toggleAllSirets = () => {
    if ((this.siretSirenListCtrl.value || []).filter(_ => _ !== undefined).length === 0) {
      this.companies$.subscribe(c => this.siretSirenListCtrl.setValue(c.map(_ => _.siret)));
    } else {
      this.siretSirenListCtrl.setValue([]);
    }
  };

  readonly toggleAllMyAccessesSirets = () => {
    if ((this.siretSirenListCtrl.value || []).filter(_ => _ !== undefined).length === 0) {
      this.myCompanies$.subscribe(c => this.siretSirenListCtrl.setValue(c.map(_ => _.companySiret)));
    } else {
      this.siretSirenListCtrl.setValue([]);
    }
  };

  readonly fetchReports = (filters: ReportFiltersPro) => {
    this.loading = true;
    this.loadingError = false;
    return this.reportService.getReports(filters).pipe(
      tap((result: PaginatedData<Report>) => {
        this.loading = false;
        this.reports = result.entities;
        this.totalCount = result.totalCount;
      }),
      catchError(err => {
        this.loading = false;
        this.loadingError = true;
        throw err;
      })
    );
  };

  readonly getFormFromQueryString = (qs: ReportFiltersPro): ReportFiltersPro => {
    try {
      const { start, end, siretSirenList, status, offset, limit } = qs;
      return { start, end, siretSirenList, status, offset: offset ?? 0, limit: limit ?? this.defaultPageSize, };
    } catch (e) {
      return {};
    }
  };

  readonly initForm = (filters: ReportFilter): FormGroup => {
    this.form.patchValue(filters);
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
    return !Object.values(values).every(_ => _ === '' || _ === undefined || _ === null) || offset > 0;
  };

  readonly resetFilters = () => {
    this.form.reset({
      offset: 0,
      limit: this.defaultPageSize,
    });
  };
}

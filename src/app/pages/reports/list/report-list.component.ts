import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Report } from '../../../model/Report';
import { ReportFilter } from '../../../model/ReportFilter';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { Roles } from '../../../model/AuthUser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PaginatedData } from '../../../model/PaginatedData';
import { FormBuilder, FormGroup } from '@angular/forms';
import Utils from '../../../utils';
import { AuthenticationService } from '../../../services/authentication.service';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  roles = Roles;

  readonly defaultPageSize = 10;

  readonly formControlNamesWithAutomaticRefresh = [
    'departments',
    'period',
  ];

  loading: boolean;
  loadingError: boolean;
  searchForm: FormGroup;
  reports: PaginatedData<Report>;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private meta: Meta,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private localeService: BsLocaleService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(pages.reports.list.title);
    this.meta.updateTag({ name: 'description', content: pages.reports.list.description });
    this.localeService.use('fr');
    this.initAndBuildForm();
  }

  private initAndBuildForm = (): void => {
    const initialValues: ReportFilter = {
      tags: [],
      departments: [],
      details: undefined,
      period: undefined,
      siret: undefined,
      status: undefined,
      hasCompany: undefined,
      email: undefined,
      category: undefined,
      offset: 0,
      limit: this.defaultPageSize,
    };
    const formValues = {
      ...initialValues,
      ...this.reportService.currentReportFilter,
      ...this.activatedRoute.snapshot.queryParams,
    };
    try {
      this.buildForm(formValues);
    } catch (e) {
      // Prevent error thrown by Angular when queryParams are wrong
      this.buildForm(initialValues);
    }
    this.search();
  };

  private buildForm = (filters: ReportFilter): void => {
    const buildArrayInput = (_: string | string[]): string[][] => [Array.isArray(_) ? _ : [_]];
    this.searchForm = this.fb.group({
      ...filters,
      departments: buildArrayInput(filters.departments),
      tags: buildArrayInput(filters.tags),
    });
    merge(...this.formControlNamesWithAutomaticRefresh.map(_ => this.searchForm.get(_).valueChanges)).pipe(
      debounceTime(800),
      distinctUntilChanged(),
    ).subscribe(this.search);
  };

  onPaginationChange(event: PageEvent) {
    this.patchValue({
      offset: event.pageIndex * event.pageSize,
      limit: event.pageSize,
    });
    this.search();
  }

  private patchValue = (form: Partial<ReportFilter>) => {
    this.searchForm.patchValue(form);
  };

  onFiltersUpdate(): void {
    this.patchValue({ ...this.searchFormValue, offset: 0 });
    this.search();
  }

  private updateQueryString = (values: ReportFilter) => {
    this.router.navigate([], { queryParams: values });
  };

  get searchFormValue(): ReportFilter {
    return this.searchForm.value;
  }

  onClearFilters(): void {
    this.searchForm.reset();
    this.searchForm.patchValue({
      offset: 0,
      limit: this.defaultPageSize
    });
    this.search();
  }

  search = () => {
    // Avoid polluting the querystring
    const cleanedReport: ReportFilter = Utils.cleanObject(this.searchFormValue);
    this.updateQueryString(cleanedReport);
    this.loading = true;
    this.loadingError = false;
    this.reportService.getReports(cleanedReport).subscribe((result: PaginatedData<Report>) => {
      this.loading = false;
      this.reports = result;
    }, err => {
      this.loading = false;
      this.loadingError = true;
    });
  };

  launchExtraction() {
    this.reportService.launchExtraction(this.searchFormValue).subscribe(() => {
      // TODO(Alex) Pop toast with redirection button
      this.router.navigate(['mes-telechargements']);
    });
  }
}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Report } from '../../../model/Report';
import { ReportFilter, reportFilter2QueryString, ReportFilterQuerystring } from '../../../model/ReportFilter';
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

  readonly formControlNamesWithAutomaticRefresh: (keyof ReportFilter)[] = [
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

  readonly getFormFromQueryString = (qs: ReportFilterQuerystring): ReportFilter => {
    try {
      const parseBooleanOption = (_: string): boolean | undefined => ({ 'true': true, 'false': false, })[_];
      const {
        offset,
        limit,
        tags,
        departments,
        companyCountries,
        hasCompany,
        start,
        end,
      } = qs;
      return {
        ...qs,
        offset: +offset ?? 0,
        limit: +limit ?? this.defaultPageSize,
        tags: Array.isArray(tags) ? tags : (tags !== undefined ? [tags] : undefined),
        departments: departments?.split(','),
        companyCountries: companyCountries?.split(','),
        hasCompany: parseBooleanOption(hasCompany),
        period: (start && end) && [new Date(start).toString(), new Date(end).toString()],
      };
    } catch (e) {
      console.error('Caught error on "reportFilterFromQueryString"', qs, e);
      return {};
    }
  };

  private initAndBuildForm = (): void => {
    const initialValues: ReportFilter = {
      tags: [],
      departments: [],
      companyCountries: [],
      details: undefined,
      period: undefined,
      siret: undefined,
      status: undefined,
      hasCompany: undefined,
      websiteURL: undefined,
      phone: undefined,
      email: undefined,
      category: undefined,
      offset: 0,
      limit: this.defaultPageSize,
    };
    const formValues = {
      ...initialValues,
      ...this.reportService.currentReportFilter,
      ...this.getFormFromQueryString(this.activatedRoute.snapshot.queryParams),
    };
    try {
      this.buildForm(formValues);
    } catch (e) {
      // Prevent error thrown by Angular when queryParams are wrong
      console.error('[ReportListComponent] Cannot build form from querystring', e, formValues);
      this.buildForm(initialValues);
    }
    this.search();
  };

  private buildForm = (filters: ReportFilter): void => {
    const wrapValuesInArray = (o: object) => Object.entries(o).reduce((acc, [k, v]) => ({ ...acc, [k]: [v] }), {});
    this.searchForm = this.fb.group(wrapValuesInArray(filters));
    merge(...this.formControlNamesWithAutomaticRefresh.map(_ => this.searchForm.get(_).valueChanges))
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe(this.search);
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
    this.router.navigate([], { queryParams: reportFilter2QueryString(values), replaceUrl: true });
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

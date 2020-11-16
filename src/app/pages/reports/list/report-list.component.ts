import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Report } from '../../../model/Report';
import moment from 'moment';
import { ReportFilter } from '../../../model/ReportFilter';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { Permissions, Roles } from '../../../model/AuthUser';
import { Tag } from '../../../model/Anomaly';
import { ConstantService } from '../../../services/constant.service';
import { AnomalyService } from '../../../services/anomaly.service';
import { ActivatedRoute, Router } from '@angular/router';
import oldCategories from '../../../../assets/data/old-categories.json';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PaginatedData } from '../../../model/PaginatedData';
import { FormBuilder, FormGroup } from '@angular/forms';
import Utils from '../../../utils';
import { AuthenticationService } from '../../../services/authentication.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  permissions = Permissions;
  roles = Roles;
  tags: Tag[];

  reportsByDate: {date: string, reports: Array<Report>}[];
  totalCount: number;
  readonly defaultPageSize = 10;
  page = 1;

  siretUrlParam: string;
  statusList: string[];
  categories: string[];

  loading: boolean;
  loadingError: boolean;
  searchForm: FormGroup;
  data: Report[] = [];

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private meta: Meta,
    private fb: FormBuilder,
    private anomalyService: AnomalyService,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private constantService: ConstantService,
    private localeService: BsLocaleService,
    private modalService: BsModalService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(pages.reports.list.title);
    this.meta.updateTag({ name: 'description', content: pages.reports.list.description });
    this.localeService.use('fr');
    this.initAndBuildForm();

    this.constantService.getReportStatusList().subscribe(
      statusList => this.statusList = statusList
    );

    this.categories = [
      ...this.anomalyService.getAnomalies().filter(anomaly => !anomaly.information).map(anomaly => anomaly.category),
      ...oldCategories
    ];

    this.tags = this.anomalyService.getTags();
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
    this.searchForm = this.fb.group({
      ...filters,
      tags: [filters.tags],
      departments: [filters.departments],
    });
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
    this.data = [];
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
    const cleanedReport: ReportFilter = Utils.cleanObject(this.searchFormValue);
    this.updateQueryString(cleanedReport);
    this.loading = true;
    this.loadingError = false;
    this.reportService.getReports(cleanedReport).subscribe((result: PaginatedData<Report>) => {
      this.loading = false;
      this.data = result.entities;
      this.totalCount = result.totalCount;
    }, err => {
      this.loading = false;
      this.loadingError = true;
    });
  };

  updateReport(reportId: string) {
    this.reportService.getReport(reportId).subscribe(
      report => {
        const reportsByDateToUpload = this.reportsByDate.find(reportsByDate => {
            return reportsByDate.date === moment(report.creationDate).format('DD/MM/YYYY');
          }).reports;
          reportsByDateToUpload.splice(reportsByDateToUpload.findIndex(r => r.id === report.id), 1, report);
        },
      err => {
        this.search();
      });
  }

  launchExtraction() {
    this.reportService.launchExtraction(this.searchFormValue).subscribe(() => {
      // TODO(Alex) Pop un toast avec rediretion
      this.router.navigate(['mes-telechargements']);
    });
  }
}

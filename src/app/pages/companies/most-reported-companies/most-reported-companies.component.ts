import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NbReportsGroupByCompany } from '../../../model/NbReportsGroupByCompany';
import { Location } from '@angular/common';
import { BsLocaleService } from 'ngx-bootstrap';
import pages from '../../../../assets/data/pages.json';
import { Roles } from '../../../model/AuthUser';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-most-reported-companies',
  templateUrl: './most-reported-companies.component.html',
  styleUrls: ['./most-reported-companies.component.scss']
})
export class MostReportedCompaniesComponent implements OnInit {

  roles = Roles;
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;
  lines: NbReportsGroupByCompany[];

  loading: boolean;
  loadingError: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
    private titleService: Title,
    private meta: Meta,
    private localeService: BsLocaleService,
    private location: Location,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.reports.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.reports.description });
    this.localeService.use('fr');
    this.loading = true;
    this.loadingError = false;

    this.loadReports(1);
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

          this.lines = result.entities ? result.entities : [];
        },
        err => {
          console.error(err);
          this.loading = false;
          this.loadingError = true;
        });
  }

  changePage(pageEvent: { page: number, itemPerPage: number }) {
    if (this.currentPage !== pageEvent.page) {
      this.loadReports(pageEvent.page);
      this.location.go('suivi-des-signalements', `page_number=${pageEvent.page}`);
    }
  }
}

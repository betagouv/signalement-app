import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Report } from '../../../../model/Report';
import { Location } from '@angular/common';
import { BsLocaleService } from 'ngx-bootstrap';
import { AuthenticationService } from '../../../../services/authentication.service';
import pages from '../../../../../assets/data/pages.json';
import { Roles, User } from 'src/app/model/AuthUser';
import { ReportService } from '../../../../services/report.service';
import { ReportFilter } from '../../../../model/ReportFilter';

@Component({
  selector: 'app-most-reported-list',
  templateUrl: './most-reported-list.component.html',
  styleUrls: ['./most-reported-list.component.scss']
})
export class MostReportedListComponent implements OnInit {

  user: User;
  roles = Roles;
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;
  reports: Report[];

  loading: boolean;
  loadingError: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
    private titleService: Title,
    private meta: Meta,
    private localeService: BsLocaleService,
    private location: Location,
    private authenticationService: AuthenticationService,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.reports.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.reports.description });
    this.localeService.use('fr');

    this.authenticationService.user.subscribe(user => {
      this.user = user;

      console.log(this.user);
    });


    if (this.user && this.user.role === Roles.Pro) {
    }


    this.loading = true;
    this.loadingError = false;

    this.loadReports(1);
  }

  loadReports(page: number) {
    this.loading = true;
    this.loadingError = false;

    this.reportService.getReports(
      (page - 1) * this.itemsPerPage,
      this.itemsPerPage,
      new ReportFilter()).subscribe(
        result => {
          this.loading = false;

          this.totalCount = result.totalCount;
          this.currentPage = page;

          this.reports = result.entities ? result.entities : [];

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
      this.location.go(`suivi-des-signalements/page/${pageEvent.page}`);
    }
  }


}

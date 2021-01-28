import { Component, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ReportedPhoneService } from '../../services/reported-phone.service';
import pages from '../../../assets/data/pages.json';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { Roles } from '../../model/AuthUser';
import { AuthenticationService } from '../../services/authentication.service';
import { PhoneWithReportCount } from '../../model/ReportedPhone';

@Component({
  selector: 'app-reported-phones',
  templateUrl: './reported-phones.component.html',
  styleUrls: ['./reported-phones.component.scss']
})
export class ReportedPhonesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  roles = Roles;

  phoneFilter?: string;
  periodFilter?: Date[];

  dataSource?: MatTableDataSource<PhoneWithReportCount>;

  readonly columns = [
    'phone',
    'siret',
    'count',
  ];

  constructor(private titleService: Title,
              private meta: Meta,
              private localeService: BsLocaleService,
              private router: Router,
              public authenticationService: AuthenticationService,
              public reportedPhoneService: ReportedPhoneService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.reportedPhones.title);
    this.meta.updateTag({ name: 'description', content: pages.reportedPhones.description });
    this.localeService.use('fr');
    this.fetchReportedPhones();
  }

  fetchReportedPhones() {
    return this.reportedPhoneService.fetch(
      this.phoneFilter ?? null,
      (this.periodFilter && this.periodFilter[0]) ?? null,
      (this.periodFilter && this.periodFilter[1]) ?? null
    ).pipe(
      tap(phones => this.initializeDatatable(phones))
    ).subscribe();
  }

  initializeDatatable(phones: PhoneWithReportCount[]) {
    this.dataSource = new MatTableDataSource(phones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  clearFilters() {
    this.periodFilter = undefined;
    this.phoneFilter = undefined;
    this.fetchReportedPhones();
  }

  extract() {
    this.reportedPhoneService.extract(
      this.phoneFilter ?? null,
      (this.periodFilter && this.periodFilter[0]) ?? null,
      (this.periodFilter && this.periodFilter[1]) ?? null
    ).subscribe(() => {
      this.router.navigate(['mes-telechargements']);
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportedPhoneService } from '../../services/reported-phone.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Roles } from '../../model/AuthUser';
import { AuthenticationService } from '../../services/authentication.service';
import { ReportedPhone } from '../../model/ReportedPhone';

@Component({
  selector: 'app-reported-phones',
  templateUrl: './reported-phones.component.html',
  styleUrls: ['./reported-phones.component.scss']
})
export class ReportedPhonesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  readonly roles = Roles;

  phoneFilter?: string;
  periodFilter?: Date[];

  dataSource?: MatTableDataSource<ReportedPhone>;

  readonly columns = [
    'phone',
    'category',
    'siret',
    'companyName',
    'count',
    'actions',
  ];

  constructor(private router: Router,
              public authenticationService: AuthenticationService,
              public reportedPhoneService: ReportedPhoneService) { }

  ngOnInit() {
    this.fetchReportedPhones();
  }

  fetchReportedPhones() {
    return this.reportedPhoneService.fetch(
      this.phoneFilter,
      (this.periodFilter && this.periodFilter[0]),
      (this.periodFilter && this.periodFilter[1])
    ).pipe(
      tap(phones => this.initializeDatatable(phones))
    ).subscribe();
  }

  initializeDatatable(phones: ReportedPhone[]) {
    this.dataSource = new MatTableDataSource(phones);
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  }

  clearFilters() {
    this.periodFilter = undefined;
    this.phoneFilter = undefined;
    this.fetchReportedPhones();
  }

  extract() {
    this.reportedPhoneService.extract(
      this.phoneFilter,
      (this.periodFilter && this.periodFilter[0]),
      (this.periodFilter && this.periodFilter[1])
    ).subscribe(() => {
      this.router.navigate(['mes-telechargements']);
    });
  }
}

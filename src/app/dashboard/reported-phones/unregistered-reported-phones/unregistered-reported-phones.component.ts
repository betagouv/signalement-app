import { Component, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ReportedPhoneService } from '../../../services/reported-phone.service';
import pages from '../../../../assets/data/pages.json';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { Roles } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { PhoneWithReportCount } from '../../../model/ReportedPhone';

@Component({
  selector: 'app-unregistered-reported-phones',
  templateUrl: './unregistered-reported-phones.component.html',
  styleUrls: ['./unregistered-reported-phones.component.scss']
})
export class UnregisteredReportedPhonesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  roles = Roles;

  phoneFilter?: string;
  periodFilter?: Date[];

  dataSource?: MatTableDataSource<PhoneWithReportCount>;

  readonly columns = [
    'phone',
    'count',
  ];

  constructor(private titleService: Title,
              private meta: Meta,
              private localeService: BsLocaleService,
              private router: Router,
              public authenticationService: AuthenticationService,
              public reportedPhoneService: ReportedPhoneService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.reportedPhones.unregistered.title);
    this.meta.updateTag({ name: 'description', content: pages.reportedPhones.unregistered.description });
    this.localeService.use('fr');
    this.fetchUnregisteredReportedPhones();
  }

  fetchUnregisteredReportedPhones() {
    return this.reportedPhoneService.listUnregistered(
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
    this.fetchUnregisteredReportedPhones();
  }

  extract() {
    this.reportedPhoneService.extractUnregistered(
      this.phoneFilter ?? null,
      (this.periodFilter && this.periodFilter[0]) ?? null,
      (this.periodFilter && this.periodFilter[1]) ?? null
    ).subscribe(() => {
      this.router.navigate(['mes-telechargements']);
    });
  }

}

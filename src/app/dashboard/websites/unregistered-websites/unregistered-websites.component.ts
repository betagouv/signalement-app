import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../../../services/website.service';
import { MatTableDataSource } from '@angular/material/table';
import { HostWithReportCount } from '../../../model/Website';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Roles } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { FormControl, FormGroup } from '@angular/forms';
import Utils from '../../../utils';

@Component({
  selector: 'app-unregistered-websites',
  templateUrl: './unregistered-websites.component.html',
  styleUrls: ['./unregistered-websites.component.scss']
})
export class UnregisteredWebsitesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  roles = Roles;

  readonly hostCtrl = new FormControl();
  readonly startCtrl = new FormControl();
  readonly endCtrl = new FormControl();
  readonly form = new FormGroup({
    host: this.hostCtrl,
    start: this.startCtrl,
    end: this.endCtrl,
  });

  dataSource?: MatTableDataSource<HostWithReportCount>;

  readonly columns = [
    'host',
    'count',
  ];

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    public websiteService: WebsiteService) {
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe(this.fetchUnregisteredWebsites);
    this.fetchUnregisteredWebsites();
  }

  readonly dateToApi = Utils.dateToApi;

  fetchUnregisteredWebsites = ({ host, start, end }: {host?: string, start?: Date, end?: Date} = {}) => {
    return this.websiteService.listUnregistered(host, start, end)
      .pipe(tap(this.initializeDatatable))
      .subscribe();
  };

  initializeDatatable = (hosts: HostWithReportCount[]) => {
    this.dataSource = new MatTableDataSource(hosts);
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  };

  clearFilters() {
    this.form.reset();
    this.fetchUnregisteredWebsites();
  }

  extract() {
    const { host, start, end } = this.form.value;
    this.websiteService.extractUnregistered(host, start, end).subscribe(() => {
      this.router.navigate(['mes-telechargements']);
    });
  }
}

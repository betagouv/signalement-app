import { Component, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { WebsiteService } from '../../../services/website.service';
import pages from '../../../../assets/data/pages.json';
import { MatTableDataSource } from '@angular/material/table';
import { HostWithReportCount } from '../../../model/Website';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { Roles } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-unregistered-websites',
  templateUrl: './unregistered-websites.component.html',
  styleUrls: ['./unregistered-websites.component.scss']
})
export class UnregisteredWebsitesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  constructor(private titleService: Title,
    private meta: Meta,
    private localeService: BsLocaleService,
    private router: Router,
    public authenticationService: AuthenticationService,
    public websiteService: WebsiteService) {
  }

  ngOnInit() {
    this.titleService.setTitle(pages.websites.unregistered.title);
    this.meta.updateTag({ name: 'description', content: pages.websites.unregistered.description });
    this.localeService.use('fr');
    this.form.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe(this.fetchUnregisteredWebsites);
    this.fetchUnregisteredWebsites();
  }

  fetchUnregisteredWebsites = ({ host, start, end }: {host?: string, start?: Date, end?: Date} = {}) => {
    return this.websiteService.listUnregistered(host, start, end)
      .pipe(tap(this.initializeDatatable))
      .subscribe();
  };

  initializeDatatable = (hosts: HostWithReportCount[]) => {
    this.dataSource = new MatTableDataSource(hosts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

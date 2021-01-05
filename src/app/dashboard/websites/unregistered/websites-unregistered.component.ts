import { Component, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { WebsiteService } from '../../../services/website.service';
import pages from '../../../../assets/data/pages.json';
import { MatTableDataSource } from '@angular/material/table';
import { HostWithReportCount } from '../../../model/Website';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { Roles } from '../../../model/AuthUser';

@Component({
  selector: 'app-unregistered',
  templateUrl: './websites-unregistered.component.html',
  styleUrls: ['./websites-unregistered.component.scss']
})
export class WebsitesUnregisteredComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  roles = Roles;

  hostFilter?: string;
  periodFilter?: Date[];

  dataSource?: MatTableDataSource<HostWithReportCount>;

  readonly columns = [
    'count',
    'host'
  ];

  constructor(private titleService: Title,
              private meta: Meta,
              private localeService: BsLocaleService,
              private router: Router,
              public websiteService: WebsiteService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.websites.unregistered.title);
    this.meta.updateTag({ name: 'description', content: pages.websites.unregistered.description });
    this.localeService.use('fr');
    this.fetchUnregisteredWebsites();
  }

  fetchUnregisteredWebsites() {
    return this.websiteService.listUnregistered(
      this.hostFilter ?? null,
      (this.periodFilter && this.periodFilter[0]) ?? null,
      (this.periodFilter && this.periodFilter[1]) ?? null
    ).pipe(
      tap(hosts => this.initializeDatatable(hosts))
    ).subscribe();
  }

  initializeDatatable(hosts: HostWithReportCount[]) {
    this.dataSource = new MatTableDataSource(hosts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  clearFilters() {
    this.periodFilter = undefined;
    this.hostFilter = undefined;
    this.fetchUnregisteredWebsites();
  }

  extract() {
    this.websiteService.extractUnregistered(
      this.hostFilter ?? null,
      (this.periodFilter && this.periodFilter[0]) ?? null,
      (this.periodFilter && this.periodFilter[1]) ?? null
    ).subscribe(() => {
      this.router.navigate(['mes-telechargements']);
    });
  }

}

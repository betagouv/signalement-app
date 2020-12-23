import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { WebsiteService } from '../../../services/website.service';
import pages from '../../../../assets/data/pages.json';
import { MatTableDataSource } from '@angular/material/table';
import { HostWithReportCount } from '../../../model/Website';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-unregistered',
  templateUrl: './websites-unregistered.component.html',
  styleUrls: ['./websites-unregistered.component.scss']
})
export class WebsitesUnregisteredComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('hostFilter') hostFilter: ElementRef;

  periodFilter: Date[];

  dataSource?: MatTableDataSource<HostWithReportCount>;

  readonly columns = [
    'count',
    'host'
  ];

  constructor(private titleService: Title,
              private meta: Meta,
              private localeService: BsLocaleService,
              public websiteService: WebsiteService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.websites.unregistered.title);
    this.meta.updateTag({ name: 'description', content: pages.websites.unregistered.description });
    this.localeService.use('fr');
    this.fetchUnregisteredWebsites();
  }

  fetchUnregisteredWebsites() {
    const start = (this.periodFilter && this.periodFilter[0]) ?? null;
    const end = (this.periodFilter && this.periodFilter[1]) ?? null;
    this.websiteService.listUnregistered(start, end).pipe(
      tap(hosts => this.initializeDatatable(hosts))
    ).subscribe();
  }

  ngAfterViewInit() {
    fromEvent(this.hostFilter.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => this.dataSource.filter = this.hostFilter.nativeElement.value)
      )
      .subscribe();
  }

  initializeDatatable(hosts: HostWithReportCount[]) {
    this.dataSource = new MatTableDataSource(hosts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.hostFilter.nativeElement.value;
  }

}

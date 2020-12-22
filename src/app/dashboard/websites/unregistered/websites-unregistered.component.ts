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

@Component({
  selector: 'app-unregistered',
  templateUrl: './websites-unregistered.component.html',
  styleUrls: ['./websites-unregistered.component.scss']
})
export class WebsitesUnregisteredComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('hostInput') hostInput: ElementRef;

  dataSource?: MatTableDataSource<HostWithReportCount>;

  readonly columns = [
    'count',
    'host'
  ];

  constructor(private titleService: Title,
              private meta: Meta,
              public websiteService: WebsiteService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.websites.unregistered.title);
    this.meta.updateTag({ name: 'description', content: pages.websites.unregistered.description });
    this.fetchUnregisteredWebsites();
  }

  fetchUnregisteredWebsites() {
    this.websiteService.listUnregistered().pipe(
      tap(hosts => this.initializeDatatable(hosts))
    ).subscribe();
  }

  ngAfterViewInit() {
    fromEvent(this.hostInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => this.dataSource.filter = this.hostInput.nativeElement.value)
      )
      .subscribe();
  }

  initializeDatatable(hosts: HostWithReportCount[]) {
    this.dataSource = new MatTableDataSource(hosts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}

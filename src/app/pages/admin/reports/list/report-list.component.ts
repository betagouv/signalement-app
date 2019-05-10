import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../../../services/report.service';
import { Report } from '../../../../model/Report';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import moment from 'moment';
import { BsLocaleService, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EventComponent } from '../event/event.component';
import { Department, Region, Regions, ReportFilter } from '../../../../model/ReportFilter';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../../assets/data/pages.json';
import { StorageService } from '../../../../services/storage.service';
import { deserialize } from 'json-typescript-mapper';
import { isPlatformBrowser } from '@angular/common';

const ReportFilterStorageKey = 'ReportFilterSignalConso';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit, OnDestroy {

  regions = Regions;
  reportsByDate: {date: string, reports: Array<Report>}[];
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;

  reportFilter: ReportFilter;
  periodValue: any;
  reportExtractUrl: string;

  modalRef: BsModalRef;
  modalOnHideSubscription: Subscription;
  
  selectedReportId: string;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private titleService: Title,
              private meta: Meta,
              private reportService: ReportService,
              private fileUploaderService: FileUploaderService,
              private storageService: StorageService,
              private localeService: BsLocaleService,
              private modalService: BsModalService) {
}

  ngOnInit() {

    this.titleService.setTitle(pages.admin.reports.title);
    this.meta.updateTag({ name: 'description', content: pages.admin.reports.description });
    this.localeService.use('fr');

    this.reportFilter = {
      period: []
    };
    this.storageService.getLocalStorageItem(ReportFilterStorageKey).subscribe(
      reportFilter => {
        if (reportFilter) {
          this.reportFilter = deserialize(ReportFilter, reportFilter);
          this.periodValue = this.reportFilter.period;
        }
        this.loadReports();
      }
    );

    this.modalOnHideSubscription = this.updateReportOnModalHide();
  }

  ngOnDestroy() {
    this.modalOnHideSubscription.unsubscribe();
  }

  loadReports(page = 1) {
    this.getReportExtractUrl();
    this.reportService.getReports((page - 1) * this.itemsPerPage, this.itemsPerPage, this.reportFilter).subscribe(result => {
      this.reportsByDate = [];
      const distinctDates = result.entities
        .map(e => moment(e.creationDate).format('DD/MM/YYYY'))
        .filter((date, index, self) => self.indexOf(date) === index);
      distinctDates.forEach(date => {
        this.reportsByDate.push(
          {
            date: date,
            reports: result.entities.filter(e => moment(e.creationDate).format('DD/MM/YYYY') === date)
          });
      });
      this.currentPage = page;
      this.totalCount = result.totalCount;
      this.storageService.setLocalStorageItem(ReportFilterStorageKey, this.reportFilter);
    });
  }

  changePeriod(event) {
    if (this.reportFilter.period !== event) {
      this.reportFilter.period = event;
      this.loadReports();
    }
  }

  changePage(pageEvent: {page: number, itemPerPage: number}) {
    this.loadReports(pageEvent.page);
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  displayReport(report: Report) {
    this.selectedReportId = report.id;
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
  }

  closeReport() {
    this.updateReport(this.selectedReportId);
    this.selectedReportId = undefined;
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
  }

  addEvent(event$: Event, report: Report) {
    event$.stopPropagation();
    this.modalRef = this.modalService.show(
      EventComponent,
      {
        initialState: {reportId: report.id}
      });
  }

  updateReportOnModalHide() {
    return this.modalService.onHide.subscribe(reason => {
      if (!reason && this.modalRef && this.modalRef.content && this.modalRef.content.reportId) {
        this.updateReport(this.modalRef.content.reportId);
      }
    });
  }

  updateReport(reportId: string) {
    this.reportService.getReport(reportId).subscribe(
      report => {
        const reportsByDateToUpload = this.reportsByDate.find(reportsByDate => {
            return reportsByDate.date === moment(report.creationDate).format('DD/MM/YYYY');
          }).reports;
          reportsByDateToUpload.splice(reportsByDateToUpload.findIndex(r => r.id === report.id), 1, report);
        },
      err => {
        this.loadReports(this.currentPage);
      });
  }

  getReportCssClass(status: string) {
    if (status) {
      return `status-${status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-')}`;
    } else {
      return '';
    }
  }

  selectArea(area?: Region | Department) {
    this.reportFilter.area = area;
    this.loadReports();
  }

  getAreaLabel() {
    if (!this.reportFilter.area) {
      return 'Tous les départements';
    } else if (this.reportFilter.area instanceof Region) {
      return this.reportFilter.area.label;
    } else {
      return `${this.reportFilter.area.code} - ${this.reportFilter.area.label}`;
    }
  }

  getReportExtractUrl() {
    return this.reportService.getReportExtractUrl(this.reportFilter).subscribe(url => {
      this.reportExtractUrl = url;
      });
  }
}

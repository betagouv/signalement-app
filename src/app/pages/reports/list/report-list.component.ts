import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { DetailInputValue, Report, ReportStatus, StatusColor } from '../../../model/Report';
import { UploadedFile } from '../../../model/UploadedFile';
import { FileUploaderService } from '../../../services/file-uploader.service';
import moment from 'moment';
import { BsLocaleService, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ReportFilter } from '../../../model/ReportFilter';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { isPlatformBrowser, Location } from '@angular/common';
import { Permissions, Roles } from '../../../model/AuthUser';
import { ReportingDateLabel } from '../../../model/Anomaly';
import { ConstantService } from '../../../services/constant.service';
import { AnomalyService } from '../../../services/anomaly.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Department, Region, Regions } from '../../../model/Region';
import oldCategories from '../../../../assets/data/old-categories.json';

const ReportsScrollYStorageKey = 'ReportsScrollYStorageKey';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit, OnDestroy {
  permissions = Permissions;
  roles = Roles;
  reportStatus = ReportStatus;
  statusColor = StatusColor;
  regions = Regions;
  reportsByDate: {date: string, reports: Array<Report>}[];
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;

  siretUrlParam: string;
  reportFilter: ReportFilter;
  reportExtractUrl: string;
  statusList: string[];
  categories: string[];

  modalRef: BsModalRef;
  modalOnHideSubscription: Subscription;

  loading: boolean;
  loadingError: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private titleService: Title,
              private meta: Meta,
              private anomalyService: AnomalyService,
              private reportService: ReportService,
              private constantService: ConstantService,
              private fileUploaderService: FileUploaderService,
              private localeService: BsLocaleService,
              private modalService: BsModalService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.reports.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.reports.description });
    this.localeService.use('fr');

    const queryParamMap = this.route.snapshot.queryParamMap;
    const paramMap = this.route.snapshot.paramMap;

    this.constantService.getReportStatusList().subscribe(
      statusList => this.statusList = statusList
    );

    this.reportFilter = this.reportService.currentReportFilter;
    this.itemsPerPage = Number(queryParamMap.get('per_page')) || 20;

    this.siretUrlParam = paramMap.get('siret');
    if (this.siretUrlParam) {
      this.reportFilter.siret = this.siretUrlParam;
    }

    this.loadReports(Number(queryParamMap.get('page_number') || 1));

    this.categories =
      [
        ...this.anomalyService.getAnomalies().filter(anomaly => !anomaly.information).map(anomaly => anomaly.category),
        ...oldCategories
      ];

    this.modalOnHideSubscription = this.updateReportOnModalHide();
  }

  ngOnDestroy() {
    this.modalOnHideSubscription.unsubscribe();
  }

  initPagination() {
    this.totalCount = 0;
    this.currentPage = 1;
  }

  submitFilters() {
    this.location.replaceState(this.router.routerState.snapshot.url.split('?')[0], `page_number=1&per_page=${this.itemsPerPage}`);
    this.initPagination();
    this.reportFilter.siret = this.reportFilter.siret ? this.reportFilter.siret.replace(/\s/g, '') : '';
    this.loadReports(1);
  }

  cancelFilters() {
    this.reportFilter = new ReportFilter();
    this.submitFilters();
  }

  loadReports(page: number) {
    this.loading = true;
    this.loadingError = false;
    this.reportService.getReports(
      (page - 1) * this.itemsPerPage,
      this.itemsPerPage,
      Object.assign(new ReportFilter(), this.reportFilter)
    ).subscribe(
      result => {
        this.loading = false;
        this.groupReportsByDate(result.entities);
        this.totalCount = result.totalCount;
        setTimeout(() => {
          this.currentPage = page;
          if (isPlatformBrowser(this.platformId)) {
            window.scroll(
              0,
              sessionStorage.getItem(ReportsScrollYStorageKey) ? Number(sessionStorage.getItem(ReportsScrollYStorageKey)) : 260
            );
            sessionStorage.removeItem(ReportsScrollYStorageKey);
          }
        }, 1);
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  groupReportsByDate(reports: Report[]) {
    this.reportsByDate = [];
    const distinctDates = reports
      .map(e => moment(e.creationDate).format('DD/MM/YYYY'))
      .filter((date, index, self) => self.indexOf(date) === index);
    distinctDates.forEach(date => {
      this.reportsByDate.push(
        {
          date: date,
          reports: reports
            .filter(e => moment(e.creationDate).format('DD/MM/YYYY') === date)
            .sort((e1, e2) => e2.creationDate.getTime() - e1.creationDate.getTime())
        });
    });

  }

  changePage(pageEvent: {page: number, itemPerPage: number}) {
    if (this.currentPage !== pageEvent.page) {
      this.loadReports(pageEvent.page);
      this.location.go(this.router.routerState.snapshot.url.split('?')[0], `page_number=${pageEvent.page}&per_page=${this.itemsPerPage}`);
    }
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  displayReport(report: Report) {
    if (isPlatformBrowser(this.platformId) && window.scrollY) {
      sessionStorage.setItem(ReportsScrollYStorageKey, window.scrollY.toString());
    }
    this.router.navigate(['suivi-des-signalements', 'report', report.id]);
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

  selectArea(area?: Region | Department) {
    if (!area) {
      this.reportFilter.areaLabel = undefined;
      this.reportFilter.departments = [];
    } else if (area instanceof Region) {
      this.reportFilter.areaLabel = area.label;
      this.reportFilter.departments = area.departments;
    } else {
      this.reportFilter.areaLabel = `${area.code} - ${area.label}`;
      this.reportFilter.departments = [area];
    }
  }

  launchExtraction() {
    this.reportService.launchExtraction(this.reportFilter).subscribe(res => {
      this.router.navigate(['mes-telechargements']);
    });
  }

  getReportingDate(report: Report) {
    return report.detailInputValues.filter(d => d.label.indexOf(ReportingDateLabel) !== -1).map(d => d.value);
  }

  getDetailContent(detailInputValues: DetailInputValue[]) {
    const MAX_CHAR_DETAILS = 40;

    function getLines(str: String, maxLength: Number) {
      function helper(_strings, currentLine, _nbWords) {
        if (!_strings || !_strings.length) {
          return _nbWords;
        }
        if (_nbWords >= _strings.length) {
          return _nbWords;
        } else {
          const newLine = currentLine + ' ' + _strings[_nbWords];
          if (newLine.length > maxLength) {
            return _nbWords;
          } else {
            return helper(_strings, newLine, _nbWords + 1);
          }
        }
      }
      const strings = str.split(' ');
      const nbWords = helper(str.split(' '), '', 0);

      const lines = strings.reduce((prev, curr, index) => index < nbWords
        ? {...prev, line: prev.line + curr + ' '}
        : {...prev, rest: prev.rest + curr + ' '}
      , {line: '', rest: ''});

      return { line: lines.line.trim(), rest: lines.rest.trim() };
    }

    let firstLine = '';
    let secondLine = '';
    let hasNext = false;

    if (detailInputValues && detailInputValues.length) {
      if (detailInputValues.length > 2) {
        hasNext = true;
      }

      let lines = getLines(detailInputValues[0].label + ' ' + detailInputValues[0].value, MAX_CHAR_DETAILS);
      firstLine = lines.line;

      if (lines.rest) {
        lines = getLines(lines.rest, MAX_CHAR_DETAILS);
        secondLine = lines.rest ? lines.line.slice(0, -3) + '...' : lines.line;

      } else if (detailInputValues.length > 1) {
        lines = getLines(detailInputValues[1].label + ' ' + detailInputValues[1].value, MAX_CHAR_DETAILS);
        secondLine = lines.rest ? lines.line.slice(0, -3) + '...' : lines.line;
      }

      return {firstLine, secondLine, hasNext };
    }
  }
}
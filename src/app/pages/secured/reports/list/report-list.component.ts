import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ReportService } from '../../../../services/report.service';
import { DetailInputValue, Report } from '../../../../model/Report';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import moment from 'moment';
import { BsLocaleService, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EventComponent } from '../event/event.component';
import { Department, Region, Regions, ReportFilter } from '../../../../model/ReportFilter';
import { combineLatest, Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../../assets/data/pages.json';
import { StorageService } from '../../../../services/storage.service';
import { deserialize } from 'json-typescript-mapper';
import { isPlatformBrowser, Location } from '@angular/common';
import { Permissions, Roles, User } from '../../../../model/AuthUser';
import { ReportingDateLabel } from '../../../../model/Anomaly';
import { ConstantService } from '../../../../services/constant.service';
import { AnomalyService } from '../../../../services/anomaly.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../../services/authentication.service';

const ReportFilterStorageKey = 'ReportFilterSignalConso';
const ReportsScrollYStorageKey = 'ReportsScrollYStorageKey';

const GENERIC_STATUS_PRO_NOT_FINAL = "Traitement en cours";

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit, OnDestroy {

  user: User;
  permissions = Permissions;
  roles = Roles;
  regions = Regions;
  reportsByDate: {date: string, reports: Array<Report>}[];
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;

  reportFilter: ReportFilter;
  reportExtractUrl: string;
  statusProSelected: string;
  statusPros: string[];
  statusConsos: string[];
  categories: string[];

  modalRef: BsModalRef;
  modalOnHideSubscription: Subscription;

  loading: boolean;
  loadingError: boolean;

  statusProFinals: string[];
  statusProNotFinals: string[];
  availableStatusPros: string[];

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private anomalyService: AnomalyService,
              private reportService: ReportService,
              private constantService: ConstantService,
              private fileUploaderService: FileUploaderService,
              private storageService: StorageService,
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

    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });

    this.reportFilter = {
      period: []
    };

    this.loading = true;
    this.loadingError = false;
    combineLatest(
      this.storageService.getLocalStorageItem(ReportFilterStorageKey),
      this.constantService.getStatusPros(),
      this.constantService.getStatusProFinals(),
      this.constantService.getStatusConsos(),
      this.route.paramMap
    ).subscribe(
      ([reportFilter, statusPros, statusProFinals, statusConsos, params]) => {
        if (reportFilter) {
          this.reportFilter = deserialize(ReportFilter, reportFilter);
        }
        this.statusPros = statusPros;
        this.statusProFinals = statusProFinals;
        this.statusProNotFinals = statusPros.filter(status => !statusProFinals.includes(status));
        this.statusConsos = statusConsos;
        this.statusProSelected = this.reportFilter && this.reportFilter.statusPros && this.reportFilter.statusPros.length ? this.getGenericStatusProIfDgccrf(this.reportFilter.statusPros[0]) : "";
        this.loadReportExtractUrl();
        this.loadReports(params.get('pageNumber') ? Number(params.get('pageNumber')) : 1);

        this.availableStatusPros = this.getGenericsStatusProIfDgccrf()
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });

    this.categories = this.anomalyService.getAnomalies().filter(anomaly => !anomaly.information).map(anomaly => anomaly.category);
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
    this.location.go('suivi-des-signalements/page/1');
    this.reportFilter = {...this.reportFilter, statusPros: this.getSpecificStatusProIfDgccrf(this.statusProSelected)};
    this.storageService.setLocalStorageItem(ReportFilterStorageKey, this.reportFilter);
    this.loadReportExtractUrl();
    this.initPagination();

    this.loadReports(1);
  }

  cancelFilters() {
    this.reportFilter = new ReportFilter();
    this.submitFilters();
  }

  loadReports(page: number) {
    this.loading = true;
    this.loadingError = false;
    this.storageService.getLocalStorageItem(ReportFilterStorageKey).pipe(
      switchMap(reportFilter => {
        return this.reportService.getReports(
          (page - 1) * this.itemsPerPage,
          this.itemsPerPage,
          reportFilter ? deserialize(ReportFilter, reportFilter) : new ReportFilter()
        );
      })
    ).subscribe(
      result => {
        this.loading = false;
        this.groupReportsByDate(result.entities);
        this.totalCount = result.totalCount;
        setTimeout(() => {
          this.currentPage = page;
          if (isPlatformBrowser(this.platformId) && this.user && this.user.role !== Roles.Pro) {
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
      this.location.go(`suivi-des-signalements/page/${pageEvent.page}`);
    }
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  displayReport(report: Report) {
    this.router.navigate(['suivi-des-signalements', 'report', report.id]);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(ReportsScrollYStorageKey, window.scrollY.toString());
    }
  }

  addEvent(event$: Event, report: Report) {
    event$.stopPropagation();
    this.modalRef = this.modalService.show(
      EventComponent,
      {
        initialState: {reportId: report.id, siret: report.company.siret}
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
      return `status-${status.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/['']/g, '')
        .split(' ').join('-')}`;
    } else {
      return '';
    }
  }

  getReportCssClassNewReport(status: string) {
    return status ? "mr-3" : "bold mr-3"
  }

  selectArea(area?: Region | Department) {
    this.reportFilter.area = area;
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

  loadReportExtractUrl() {
    return this.reportService.getReportExtractUrl(this.reportFilter).subscribe(url => {
      this.reportExtractUrl = url;
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
        ? {...prev, line: prev.line + curr + " "}
        : {...prev, rest: prev.rest + curr + " "}
      , {line: "", rest: ""})

      return { line: lines.line.trim(), rest: lines.rest.trim() }
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

  getGenericStatusProIfDgccrf(statusPro: string): string {
    if (this.user.role === "DGCCRF") {
      return this.statusProFinals.includes(statusPro) ? statusPro : GENERIC_STATUS_PRO_NOT_FINAL;
    }
    return statusPro;

  }

  getSpecificStatusProIfDgccrf(statusPro: string): string[] {
    if (!statusPro) return [];
    if (this.user.role === "DGCCRF" && statusPro === GENERIC_STATUS_PRO_NOT_FINAL) {
      return this.statusProNotFinals;
    }
    return [statusPro];

  }

  getGenericsStatusProIfDgccrf(): string[] {

    if (this.user.role === "DGCCRF") {
      return [...this.statusProFinals, GENERIC_STATUS_PRO_NOT_FINAL];
    }
    return this.statusPros;
  }

}

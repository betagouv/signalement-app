import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, TemplateRef } from '@angular/core';
import { ReportService } from '../../../../services/report.service';
import { DetailInputValue, Report, ReportStatus } from '../../../../model/Report';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import moment from 'moment';
import { BsLocaleService, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EventComponent } from '../event/event.component';
import { ReportFilter } from '../../../../model/ReportFilter';
import { combineLatest, EMPTY, iif, Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../../assets/data/pages.json';
import { isPlatformBrowser, Location } from '@angular/common';
import { Permissions, Roles, User } from '../../../../model/AuthUser';
import { ReportingDateLabel } from '../../../../model/Anomaly';
import { ConstantService } from '../../../../services/constant.service';
import { AnomalyService } from '../../../../services/anomaly.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, take } from 'rxjs/operators';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Department, Region, Regions } from '../../../../model/Region';
import oldCategories from '../../../../../assets/data/old-categories.json';
import { AccountService } from '../../../../services/account.service';
import { HttpResponse } from '@angular/common/http';
import { EventService } from '../../../../services/event.service';
import { UserAccess } from '../../../../model/CompanyAccess';
import { CompanyAccessesService } from '../../../../services/companyaccesses.service';

const ReportsScrollYStorageKey = 'ReportsScrollYStorageKey';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit, OnDestroy {
  user: User;
  userAccesses: UserAccess[] = [];
  permissions = Permissions;
  roles = Roles;
  reportStatus = ReportStatus;
  regions = Regions;
  reportsByDate: {date: string, reports: Array<Report>}[];
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;

  reportFilter: ReportFilter;
  reportExtractUrl: string;
  statusList: string[];
  categories: string[];

  modalRef: BsModalRef;
  modalOnHideSubscription: Subscription;

  loading: boolean;
  loadingError: boolean;

  checkedReportUuids = new Set<string>();

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private anomalyService: AnomalyService,
              private reportService: ReportService,
              private constantService: ConstantService,
              private accountService: AccountService,
              private eventService: EventService,
              private companyAccessesService: CompanyAccessesService,
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

    this.authenticationService.user.pipe(
      take(1),
      mergeMap(user => {
        this.user = user;
        return iif(() => user && user.role === Roles.Pro, this.companyAccessesService.myAccesses(user), EMPTY);
      })
    ).subscribe(userAccesses => this.userAccesses = userAccesses);

    this.reportFilter = {
      period: []
    };

    this.loading = true;
    this.loadingError = false;
    combineLatest([
      this.constantService.getReportStatusList(),
      this.route.paramMap,
      this.route.queryParamMap
    ]).subscribe(
      ([statusList, params, queryParams]) => {
        const siret = params.get('siret');

        if (siret) {
          this.reportFilter = {siret};
        }

        this.statusList = statusList;
        this.loadReportExtractUrl();
        this.loadReports(Number(queryParams.get('page_number') || 1));
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });

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
    this.location.go('suivi-des-signalements', 'page_number=1');
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
      this.location.go('suivi-des-signalements', `page_number=${pageEvent.page}`);
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

  checkReport(event$: Event, reportUuid: string) {
    event$.stopPropagation();
    if (this.checkedReportUuids.has(reportUuid)) {
      this.checkedReportUuids.delete(reportUuid);
    } else {
      this.checkedReportUuids.add(reportUuid);
    }
  }

  checkAllReports(event$: Event) {
    event$.stopPropagation();
    if (this.getCurrentPageReportUuidsToProcess().length === this.checkedReportUuids.size) {
      this.checkedReportUuids.clear();
    } else {
      this.checkedReportUuids = new Set(this.getCurrentPageReportUuidsToProcess());
    }
  }

  getCurrentPageReportUuidsToProcess() {
    if (this.reportsByDate) {
      return this.reportsByDate
        .reduce((reportUuids, reportsByDate) => ([
          ...reportUuids,
          ...reportsByDate.reports.filter(r => r.status === ReportStatus.ToProcess).map(r => r.id)
        ]), []);
    }
  }

  downloadActivationDocuments() {
    if (isPlatformBrowser(this.platformId)) {
      this.accountService.downloadActivationDocuments(this.checkedReportUuids).subscribe(response => {
        const blob = new Blob([(response as HttpResponse<Blob>).body], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'courriers.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  confirmLettersSending() {
    this.loading = true;
    this.loadingError = false;
    this.eventService.confirmContactByPostOnReportList(this.checkedReportUuids).subscribe(
      events => {
        this.loading = false;
        this.modalRef.hide();
        this.loadReports(this.currentPage);
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }
}

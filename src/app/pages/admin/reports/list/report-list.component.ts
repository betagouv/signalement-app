import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../../services/report.service';
import { Report } from '../../../../model/Report';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import moment from 'moment';
import { Router } from '@angular/router';
import { BsLocaleService, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EventComponent } from '../event/event.component';
import { ReportFilter } from '../../../../model/ReportFilter';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  regions = Regions;
  reportsByDate: {date: string, reports: Array<Report>}[];
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;

  reportFilter: ReportFilter;
  departmentsValue: string;
  periodValue: any;
  reportExtractUrl: string;

  bsModalRef: BsModalRef;

  constructor(private reportService: ReportService,
              private fileUploaderService: FileUploaderService,
              private localeService: BsLocaleService,
              private router: Router,
              private modalService: BsModalService) {
}

  ngOnInit() {

    this.reportFilter = {
      departments: [],
      period: []
    };
    this.departmentsValue = 'Tous les départements';
    this.localeService.use('fr');

    this.loadReports(1);
    this.updateReportOnModalHide();
  }

  loadReports(page = 1) {
    this.currentPage = page;
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
      this.totalCount = result.totalCount;
    });
  }

  changePeriod(event) {
    this.reportFilter.period = event;
    this.loadReports();
  }

  changePage(pageEvent: {page: number, itemPerPage: number}) {
    this.loadReports(pageEvent.page);
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  openReport(report: Report) {
    this.router.navigate(['suivi-des-signalements', report.id]);
  }

  addEvent(event$: Event, report: Report) {
    event$.stopPropagation();
    this.bsModalRef = this.modalService.show(
      EventComponent,
      {
        initialState: {reportId: report.id}
      });
  }

  updateReportOnModalHide() {
    this.modalService.onHide.subscribe(reason => {
      if (!reason && this.bsModalRef.content && this.bsModalRef.content.reportId) {
        this.reportService.getReport(this.bsModalRef.content.reportId).subscribe(report => {
          const reportsByDateToUpload = this.reportsByDate.find(reportsByDate => {
            return reportsByDate.date === moment(report.creationDate).format('DD/MM/YYYY');
          }).reports;
          reportsByDateToUpload.splice(reportsByDateToUpload.findIndex(r => r.id === report.id), 1, report);
        });
      }
    });
  }

  getReportCssClass(status: string) {
    if (status) {
      return `status-${status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-')}`;
    } else {
      return '';
    }
  }

  selectDepartments(departments: { code: string, label: string }[], label) {
    this.reportFilter.departments = departments.map(d => d.code);
    this.departmentsValue = label;
    this.loadReports();
  }

  getReportExtractUrl() {
    return this.reportService.getReportExtractUrl(this.reportFilter).subscribe(url => {
      this.reportExtractUrl = url;
      });
  }
}

export const Regions = [
  {
    label: 'Centre-Val de Loire',
    departments: [
      { code: '18', label: 'Cher' },
      { code: '28', label: 'Eure-et-Loir' },
      { code: '36', label: 'Indre' },
      { code: '37', label: 'Indre-et-Loire' },
      { code: '41', label: 'Loir-et-Cher' },
      { code: '45', label: 'Loiret' },
    ]
  },
  {
    label: 'Auvergne-Rhône-Alpes',
    departments: [
      { code: '01', label: 'Ain' },
      { code: '03', label: 'Allier' },
      { code: '07', label: 'Ardèche' },
      { code: '15', label: 'Cantal' },
      { code: '26', label: 'Drôme' },
      { code: '38', label: 'Isère' },
      { code: '42', label: 'Loire' },
      { code: '43', label: 'Haute-Loire' },
      { code: '63', label: 'Puy-de-Dôme' },
      { code: '69', label: 'Rhône' },
      { code: '73', label: 'Savoie' },
      { code: '74', label: 'Haute-Savoie' }
    ]
  }];

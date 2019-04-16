import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Report } from '../../../model/Report';
import { UploadedFile } from '../../../model/UploadedFile';
import { FileUploaderService } from '../../../services/file-uploader.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  regions = [
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

  reports: Report[];
  totalCount: number;
  currentPage: number;
  itemsPerPage = 20;
  currentDepartment;

  constructor(private reportService: ReportService,
              private fileUploaderService: FileUploaderService) { }

  ngOnInit() {
    this.loadReports(1);
  }

  loadReports(page: number) {
    this.currentPage = page;
    this.reportService.getReports(
      (page - 1) * this.itemsPerPage,
      this.itemsPerPage,
      this.currentDepartment ? this.currentDepartment.code : undefined
    ).subscribe(result => {
      this.reports = result.entities;
      this.totalCount = result.totalCount;
    });
  }

  pageChanged(pageEvent: {page: number, itemPerPage: number}) {
    this.loadReports(pageEvent.page);
  }

  filterByDeparment(department?) {
    this.currentDepartment = department;
    this.loadReports(1);
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

}

import { Component, OnInit } from '@angular/core';
import { Report } from '../../../../model/Report';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ReportService } from '../../../../services/report.service';
import { Location } from '@angular/common';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  report: Report;
  loading: boolean;

  constructor(private route: ActivatedRoute,
              private reportService: ReportService,
              private fileUploaderService: FileUploaderService,
              private location: Location) { }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.reportService.getReport(params.get('reportId')))
    ).subscribe(
      report => {
       this.report = report;
       this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  back() {
    this.location.back();
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

}

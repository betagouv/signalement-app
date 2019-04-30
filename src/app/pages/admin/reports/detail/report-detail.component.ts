import { Component, OnInit } from '@angular/core';
import { Report } from '../../../../model/Report';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ReportService } from '../../../../services/report.service';
import { Location } from '@angular/common';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import { ReportEvent } from '../../../../model/ReportEvent';
import { combineLatest } from 'rxjs';
import { EventService } from '../../../../services/event.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  report: Report;
  loading: boolean;
  events: ReportEvent[];

  constructor(private route: ActivatedRoute,
              private reportService: ReportService,
              private eventService: EventService,
              private fileUploaderService: FileUploaderService,
              private location: Location) { }

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        combineLatest(
          this.reportService.getReport(params.get('reportId')),
          this.eventService.getEvents(params.get('reportId'))
        ))
    ).subscribe(
      ([report, events]) => {
       this.report = report;
       this.events = events;
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

import { Component, OnInit, TemplateRef } from '@angular/core';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  report: Report;
  loading: boolean;
  events: ReportEvent[];

  modalRef: BsModalRef;

  constructor(private route: ActivatedRoute,
              private reportService: ReportService,
              private eventService: EventService,
              private fileUploaderService: FileUploaderService,
              private location: Location,
              private modalService: BsModalService) { }

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

  openModal(template: TemplateRef<any>, uploadedFile: UploadedFile) {
    this.modalRef = this.modalService.show(template);
  }

  removeUploadedFile(uploadedFile: UploadedFile) {
    this.fileUploaderService.deleteFile(uploadedFile).subscribe(() => {
      this.modalRef.hide();
      this.report.uploadedFiles.splice(
        this.report.uploadedFiles.findIndex(f => f.id === uploadedFile.id),
        1
      );
    });
  }

}

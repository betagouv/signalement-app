import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Report } from '../../../../model/Report';
import { ReportService } from '../../../../services/report.service';
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

  @Input() reportId: string;

  @Output() close = new EventEmitter<Report>();

  report: Report;
  loading: boolean;
  events: ReportEvent[];

  modalRef: BsModalRef;

  constructor(private reportService: ReportService,
              private eventService: EventService,
              private fileUploaderService: FileUploaderService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.loading = true;
    combineLatest(
      this.reportService.getReport(this.reportId),
      this.eventService.getEvents(this.reportId)
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
    this.close.emit();
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

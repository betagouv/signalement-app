import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Report } from '../../../../model/Report';
import { ReportService } from '../../../../services/report.service';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import { ReportEvent } from '../../../../model/ReportEvent';
import { combineLatest } from 'rxjs';
import { EventService } from '../../../../services/event.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../model/Company';
import { switchMap } from 'rxjs/operators';
import { Permissions } from '../../../../model/AuthUser';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  @Input() reportId: string;

  @Output() close = new EventEmitter();

  permissions = Permissions;
  report: Report;
  loading: boolean;
  events: ReportEvent[];

  modalRef: BsModalRef;
  reportIdToDelete: string;

  companyForm: FormGroup;
  siretCtrl: FormControl;
  companyForSiret: Company;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private eventService: EventService,
              private fileUploaderService: FileUploaderService,
              private companyService: CompanyService,
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

    this.initCompanyForm();
  }

  initCompanyForm() {
    this.siretCtrl = this.formBuilder.control('', [Validators.required, Validators.pattern('[0-9]{14}')]);

    this.companyForm = this.formBuilder.group({
      siret: this.siretCtrl
    });
  }

  back() {
    this.close.emit();
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  openModal(template: TemplateRef<any>) {
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

  deleteReport() {
    this.reportService.deleteReport(this.reportId).subscribe(() => {
      this.modalRef.hide();
      this.close.emit();
    });
  }

  submitCompanyForm() {
    this.loading = true;
    this.companyService.searchCompaniesBySiret(this.siretCtrl.value).subscribe(
      company => {
        this.loading = false;
        this.companyForSiret = company ? company : new Company();
      }
    );
  }

  changeCompany() {
    this.reportService.updateReport(Object.assign(new Report(), this.report, {company: this.companyForSiret}))
      .pipe(
        switchMap(() => {
          return this.eventService.createEvent(Object.assign(new ReportEvent(), {
            reportId: this.reportId,
            eventType: 'RECTIF',
            action: {name: 'Modification du commerçant'},
            detail: `Commerçant précédent : Siret ${this.report.company.siret ? this.report.company.siret : 'non renseigné'} - ${this.reportService.company2adresseApi(this.report.company)}`
          }));
        }),
        switchMap(() => {
          return this.eventService.getEvents(this.reportId);
        })
      )
      .subscribe(events => {
        this.report.company = this.companyForSiret;
        this.events = events;
        this.companyForSiret = undefined;
        this.siretCtrl.setValue('');
        this.modalRef.hide();
      });
  }


}

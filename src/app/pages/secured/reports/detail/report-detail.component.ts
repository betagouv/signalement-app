import { Component, OnInit, TemplateRef } from '@angular/core';
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
import { Permissions, Roles } from '../../../../model/AuthUser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Consumer } from '../../../../model/Consumer';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  reportId: string;

  permissions = Permissions;
  roles = Roles;
  report: Report;
  loading: boolean;
  loadingError: boolean;
  events: ReportEvent[];

  bsModalRef: BsModalRef;
  reportIdToDelete: string;

  companyForm: FormGroup;
  siretCtrl: FormControl;
  companyForSiret: Company;

  consumerForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;
  contactAgreementCtrl: FormControl;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private eventService: EventService,
              private fileUploaderService: FileUploaderService,
              private companyService: CompanyService,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private platformLocation: PlatformLocation) { }

  ngOnInit() {
    this.loading = true;
    this.loadingError = false;
    this.platformLocation.onPopState(() => {
      if (this.bsModalRef) {
        this.bsModalRef.hide();
      }
    });
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
          this.reportId = params.get('reportId');
          return combineLatest(
            this.reportService.getReport(this.reportId),
            this.eventService.getEvents(this.reportId)
          );
        }
      )
    ).subscribe(
      ([report, events]) => {
        this.report = report;
        this.events = events;
        this.loading = false;
        this.initConsumerForm();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });

    this.initCompanyForm();
  }

  initCompanyForm() {
    this.siretCtrl = this.formBuilder.control('', [Validators.required, Validators.pattern('[0-9]{14}')]);

    this.companyForm = this.formBuilder.group({
      siret: this.siretCtrl
    });
  }

  initConsumerForm() {
    this.firstNameCtrl = this.formBuilder.control(this.report.consumer.firstName, Validators.required);
    this.lastNameCtrl = this.formBuilder.control(this.report.consumer.lastName, Validators.required);
    this.emailCtrl = this.formBuilder.control(this.report.consumer.email, [Validators.required, Validators.email]);
    this.contactAgreementCtrl = this.formBuilder.control(this.report.contactAgreement, Validators.required);

    this.consumerForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl,
      contactAgreement: this.contactAgreementCtrl
    });
  }

  back() {
    this.platformLocation.back();
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  openModal(template: TemplateRef<any>) {
    this.loadingError = false;
    this.bsModalRef = this.modalService.show(template);
  }

  removeUploadedFile(uploadedFile: UploadedFile) {
    this.fileUploaderService.deleteFile(uploadedFile).subscribe(
      () => {
        this.bsModalRef.hide();
        this.report.uploadedFiles.splice(
          this.report.uploadedFiles.findIndex(f => f.id === uploadedFile.id),
          1
        );
      });
  }

  deleteReport() {
    this.loading = true;
    this.loadingError = false;
    this.reportService.deleteReport(this.reportId).subscribe(
      () => {
        this.loading = false;
        this.bsModalRef.hide();
        this.platformLocation.back();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  submitCompanyForm() {
    this.loading = true;
    this.loadingError = false;
    this.companyService.searchCompaniesBySiret(this.siretCtrl.value).subscribe(
      company => {
        this.loading = false;
        this.companyForSiret = company ? company : new Company();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  changeCompany() {
    this.loading = true;
    this.loadingError = false;
    this.reportService.updateReport(Object.assign(new Report(), this.report, {company: this.companyForSiret}))
      .pipe(
        switchMap(() => {
          return this.eventService.createEvent(Object.assign(new ReportEvent(), {
            reportId: this.reportId,
            eventType: 'RECTIF',
            action: {name: 'Modification du commerçant'},
            detail: `Commerçant précédent : Siret ${this.report.company.siret ? this.report.company.siret : 'non renseigné'} - ` +
              `${this.reportService.company2adresseApi(this.report.company)}`
          }));
        }),
        switchMap(() => {
          return this.eventService.getEvents(this.reportId);
        })
      )
      .subscribe(
        events => {
          this.report.company = this.companyForSiret;
          this.events = events;
          this.companyForSiret = undefined;
          this.siretCtrl.setValue('');
          this.bsModalRef.hide();
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
  }

  submitConsumerForm() {
    this.loading = true;
    this.loadingError = false;
    const consumer = Object.assign(new Consumer(),
      {
        firstName: this.firstNameCtrl.value,
        lastName: this.lastNameCtrl.value,
        email: this.emailCtrl.value
      });
    const contactAgreement = this.contactAgreementCtrl.value;
    this.reportService.updateReport(Object.assign(new Report(), this.report, { consumer, contactAgreement }))
      .pipe(
        switchMap(() => {
          return this.eventService.createEvent(Object.assign(new ReportEvent(), {
            reportId: this.reportId,
            eventType: 'RECTIF',
            action: {name: 'Modification du consommateur'},
            detail: `Consommateur précédent : ${this.report.consumer.firstName} ${this.report.consumer.lastName}` +
              ` - ${this.report.consumer.email} - Accord pour contact : ${this.report.contactAgreement ? 'oui' : 'non'}`
          }));
        }),
        switchMap(() => {
          return this.eventService.getEvents(this.reportId);
        })
      )
      .subscribe(
        events => {
          this.report.consumer = consumer;
          this.report.contactAgreement = contactAgreement;
          this.events = events;
          this.bsModalRef.hide();
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
  }


}

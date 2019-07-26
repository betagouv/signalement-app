import { Component, OnInit, TemplateRef } from '@angular/core';
import { Report } from '../../../../model/Report';
import { ReportService } from '../../../../services/report.service';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import { ProAnswerReportEventAction, ReportEvent } from '../../../../model/ReportEvent';
import { combineLatest } from 'rxjs';
import { EventService } from '../../../../services/event.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../model/Company';
import { switchMap } from 'rxjs/operators';
import { Permissions, Roles } from '../../../../model/AuthUser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;
  events: ReportEvent[];

  bsModalRef: BsModalRef;
  reportIdToDelete: string;

  companySiretForm: FormGroup;
  siretCtrl: FormControl;
  companyForSiret: Company;
  searchBySiret = true;

  companyAddressForm: FormGroup;
  nameCtrl: FormControl;
  line1Ctrl: FormControl;
  line2Ctrl: FormControl;
  line3Ctrl: FormControl;
  postalCodeCtrl: FormControl;
  cityCtrl: FormControl;

  consumerForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;
  contactAgreementCtrl: FormControl;

  proAnswerForm: FormGroup;
  answerCtrl: FormControl;
  answerSuccess: boolean;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private eventService: EventService,
              private fileUploaderService: FileUploaderService,
              private companyService: CompanyService,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private router: Router,
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

    this.initCompanySiretForm();
    this.initCompanyAddressForm();
  }

  initCompanySiretForm() {
    this.siretCtrl = this.formBuilder.control('', [Validators.required, Validators.pattern('[0-9]{14}')]);

    this.companySiretForm = this.formBuilder.group({
      siret: this.siretCtrl
    });
  }

  initCompanyAddressForm() {
    this.nameCtrl = this.formBuilder.control('', Validators.required);
    this.line1Ctrl = this.formBuilder.control('', Validators.required);
    this.line2Ctrl = this.formBuilder.control('');
    this.line3Ctrl = this.formBuilder.control('');
    this.postalCodeCtrl = this.formBuilder.control('', [Validators.required, Validators.pattern('[0-9]{5}')]);
    this.cityCtrl = this.formBuilder.control('', Validators.required);

    this.companyAddressForm = this.formBuilder.group({
      name: this.nameCtrl,
      line1: this.line1Ctrl,
      line2: this.line2Ctrl,
      line3: this.line3Ctrl,
      postalCode: this.postalCodeCtrl,
      city: this.cityCtrl,
    });
  }

  changeCompanySearchTab() {
    this.searchBySiret = !this.searchBySiret;
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

  submitCompanySiretForm() {
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

  submitCompanyAddressForm() {
    this.changeCompany(Object.assign(new Company(), {
      siret: this.report.company.siret,
      name: this.nameCtrl.value,
      line1: this.nameCtrl.value,
      line2: this.line1Ctrl.value,
      line3: this.line2Ctrl.value,
      line4: this.line3Ctrl.value,
      line5: `${this.postalCodeCtrl.value} ${this.cityCtrl.value}`,
      postalCode: this.postalCodeCtrl.value,
    }));
  }

  changeCompany(company: Company) {
    this.loading = true;
    this.loadingError = false;
    this.reportService.updateReport(Object.assign(new Report(), this.report, { company }))
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
          this.report.company = company;
          this.events = events;
          this.companyForSiret = undefined;
          this.siretCtrl.setValue('');
          this.bsModalRef.hide();
        },
        err => {
          console.log('err', err)
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

  showProAnswerForm() {
    this.answerCtrl = this.formBuilder.control('', Validators.required);
    this.proAnswerForm = this.formBuilder.group({
      answer: this.answerCtrl
    });
  }

  hideProAnswerForm() {
    this.proAnswerForm = undefined;
  }

  submitProAnswerForm() {
    if (!this.proAnswerForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.loadingError = false;
      this.eventService.createEvent(
        Object.assign(new ReportEvent(), {
          reportId: this.reportId,
          eventType: 'PRO',
          action: Object.assign(ProAnswerReportEventAction),
          detail: this.answerCtrl.value,
          resultAction: true
        })
      ).subscribe(
        event => {
          this.loading = false;
          this.events.push(event);
          this.answerSuccess = true;
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
    }

  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  getProAnswerEvent() {
    return this.events.find(event => event.action.name === ProAnswerReportEventAction.name);
  }
}

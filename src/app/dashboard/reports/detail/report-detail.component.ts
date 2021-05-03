import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Report, ReportStatus, reportStatusColor } from '../../../model/Report';
import { ReportService } from '../../../services/report.service';
import { FileOrigin, UploadedFile } from '../../../model/UploadedFile';
import { FileUploaderService } from '../../../services/file-uploader.service';
import { combineLatest, iif, of } from 'rxjs';
import { EventService } from '../../../services/event.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { Permissions, Roles } from '../../../model/AuthUser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { isPlatformBrowser, PlatformLocation } from '@angular/common';
import { Consumer } from '../../../model/Consumer';
import { EventActionValues, ReportAction, ReportEvent, ReportResponse, ReportResponseTypes } from '../../../model/ReportEvent';
import { HttpResponse } from '@angular/common/http';
import { CompanySearchResult } from '../../../model/Company';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  reportId!: string;

  eventActionValues = EventActionValues;
  permissions = Permissions;
  roles = Roles;
  statusColor = reportStatusColor;

  report?: Report;

  showErrors = false;
  loading = false;
  loadingError = false;
  events?: ReportEvent[];
  companyEvents?: ReportEvent[];

  bsModalRef?: BsModalRef;
  reportIdToDelete?: string;

  consumerForm?: FormGroup;
  firstNameCtrl?: FormControl;
  lastNameCtrl?: FormControl;
  emailCtrl?: FormControl;
  contactAgreementCtrl?: FormControl;

  responseForm?: FormGroup;
  responseConsumerDetailsCtrl?: FormControl;
  responseDgccrfDetailsCtrl?: FormControl;
  responseTypeCtrl?: FormControl;
  responseSuccess?: boolean;
  reportResponseTypes = ReportResponseTypes;
  fileOrigins = FileOrigin;
  uploadedFiles?: UploadedFile[];

  actionForm?: FormGroup;
  actionTypeCtrl?: FormControl;
  detailCtrl?: FormControl;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
    public formBuilder: FormBuilder,
    private reportService: ReportService,
    private eventService: EventService,
    private fileUploaderService: FileUploaderService,
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

    this.loadReport();
  }

  loadReport() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.reportId = params.get('reportId')!;
        return this.reportService.getReport(this.reportId);
      }),
      switchMap(report => {
        this.report = report;
        return combineLatest([
          this.eventService.getEvents(this.reportId),
          iif(() => !!this.report?.company.siret, this.eventService.getCompanyEvents(this.report!.company.siret!), of([]))
        ]);
      })
    ).subscribe(
      ([ events, companyEvents]) => {
        this.events = events
          .sort((e1, e2) => (new Date(e1.data.creationDate)).getTime() - (new Date(e2.data.creationDate).getTime()));
        this.companyEvents = companyEvents
          .filter(e => e.data.reportId === undefined)
          .sort((e1, e2) => (new Date(e1.data.creationDate)).getTime() - (new Date(e2.data.creationDate).getTime()));
        this.loading = false;
        this.initConsumerForm();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  initConsumerForm() {
    if (!this.report) {
      console.error('[SignalConso] this.report is undefined', new Error().stack);
      return;
    }
    this.firstNameCtrl = this.formBuilder.control(this.report.consumer.firstName, Validators.required);
    this.lastNameCtrl = this.formBuilder.control(this.report.consumer.lastName, Validators.required);
    this.emailCtrl = this.formBuilder.control(this.report.consumer.email, [Validators.required, Validators.email]);
    this.contactAgreementCtrl = this.formBuilder.control(this.report.contactAgreement, Validators.required);

    this.consumerForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl
    });

    if (this.report.isTransmittableToPro) {
      this.consumerForm.addControl('contactAgreement', this.contactAgreementCtrl);
    }
  }

  back() {
    this.platformLocation.back();
  }

  backEnabled() {
    return this.platformLocation.getState() && (this.platformLocation.getState() as any)['navigationId'] !== 1;
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
        this.bsModalRef?.hide();
        this.report?.uploadedFiles.splice(
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
        this.bsModalRef?.hide();
        this.platformLocation.back();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  downloadReport() {
    if (isPlatformBrowser(this.platformId)) {
      this.reportService.downloadReport(this.reportId).subscribe(response => {
        const blob = new Blob([(response as HttpResponse<Blob>).body!], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  changeCompany(company: CompanySearchResult) {
    this.loading = true;
    this.loadingError = false;
    this.reportService.updateReportCompany(this.reportId, company)
      .pipe(
        tap(report => {
          if (!this.report) {
            console.error('[SignalConso] this.report is undefined', new Error().stack);
            return;
          }
          this.report.status = report.status;
          this.report.company.siret = report.company.siret;
          this.report.company.name = report.company.name;
          this.report.company.brand = report.company.brand;
          this.report.company.address = report.company.address;
        }),
        switchMap(_ => this.eventService.getEvents(this.reportId))
      )
      .subscribe(
        events => {
          this.events = events;
          this.bsModalRef?.hide();
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
        firstName: this.firstNameCtrl!.value,
        lastName: this.lastNameCtrl!.value,
        email: this.emailCtrl!.value
      });
    const contactAgreement = this.contactAgreementCtrl!.value;
    this.reportService.updateReportConsumer(this.reportId, consumer, contactAgreement)
      .pipe(
        switchMap(() => {
          return this.eventService.getEvents(this.reportId);
        })
      )
      .subscribe(
        events => {
          this.report!.consumer = consumer;
          this.report!.contactAgreement = contactAgreement;
          this.events = events;
          this.bsModalRef?.hide();
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
  }

  showProAnswerForm() {
    this.responseTypeCtrl = this.formBuilder.control('', Validators.required);
    this.responseConsumerDetailsCtrl = this.formBuilder.control('', Validators.required);
    this.responseDgccrfDetailsCtrl = this.formBuilder.control('');
    this.responseForm = this.formBuilder.group({
      responseConsumerDetails: this.responseConsumerDetailsCtrl,
      responseDgccrfDetails: this.responseDgccrfDetailsCtrl,
      responseType: this.responseTypeCtrl
    });
    if (!this.uploadedFiles) {
      this.uploadedFiles = [];
    }
  }

  hideProAnswerForm() {
    this.responseForm = undefined;
  }

  showActionForm() {
    function detailRequired(actionType: string, detail: string) {
      return (group: FormGroup) => {
        if (group.controls[actionType].value === EventActionValues.Comment && !group.controls[detail].value) {
          return { detailRequired: true };
        }
      };
    }

    this.responseSuccess = false;
    this.actionTypeCtrl = this.formBuilder.control('', Validators.required);
    this.detailCtrl = this.formBuilder.control('');
    this.actionForm = this.formBuilder.group({
      action: this.actionTypeCtrl,
      detail: this.detailCtrl
    }, { validator: detailRequired('action', 'detail')});
    this.uploadedFiles = [];
  }

  hideActionForm() {
    this.actionForm = undefined;
  }

  isUploadingFile() {
    return this.uploadedFiles?.find(file => file.loading);
  }

  submitProAnswerForm() {
    if (!this.responseForm?.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.loadingError = false;
      this.reportService.postReportResponse(
        this.reportId,
        Object.assign(new ReportResponse(), {
          responseType: this.responseTypeCtrl!.value,
          consumerDetails: this.responseConsumerDetailsCtrl!.value,
          dgccrfDetails: this.responseDgccrfDetailsCtrl!.value,
          fileIds: this.uploadedFiles!.filter(file => file.id).map(file => file.id)
        })
      ).subscribe(
        _ => {
          this.responseSuccess = true;
          this.loadReport();
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
    }

  }

  submitActionForm() {
    if (!this.actionForm?.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.loadingError = false;
      this.reportService.postReportAction(
        this.reportId,
        Object.assign(new ReportAction(), {
          actionType: this.actionTypeCtrl!.value,
          details: this.detailCtrl!.value,
          fileIds: this.uploadedFiles!.filter(file => file.id).map(file => file.id)
        })
      ).subscribe(
        events => {
          this.responseSuccess = true;
          this.loadReport();
          this.actionForm = undefined;
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

  getEvent(eventActionValue: EventActionValues) {
    if (this.events) {
      return this.events.find(event => event.data.action.value === eventActionValue);
    }
  }

  getReportResponse(): ReportResponse | undefined {
    const reportResponseEvent = this.getEvent(EventActionValues.ReportResponse);
    if (reportResponseEvent) {
      return reportResponseEvent.data.details as ReportResponse;
    }
  }

  getTypeClass(value: string) {
    if (this.responseTypeCtrl && this.responseTypeCtrl.value) {
      return this.responseTypeCtrl.value === value ? 'selected' : 'not-selected';
    } else if (this.actionTypeCtrl && this.actionTypeCtrl.value) {
      return this.actionTypeCtrl.value === value ? 'selected' : 'not-selected';
    }
  }

  isClosed() {
    return this.report?.status === ReportStatus.ClosedForPro;
  }
}

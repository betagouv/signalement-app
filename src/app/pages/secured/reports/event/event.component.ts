import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../../services/event.service';
import { ReportEvent, ReportEventAction } from '../../../../model/ReportEvent';
import { BsModalRef } from 'ngx-bootstrap';
import { ConstantService } from '../../../../services/constant.service';
import { combineLatest } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { Permissions, Roles } from '../../../../model/AuthUser';
import { AccountService } from '../../../../services/account.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss', '../../../../app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EventComponent implements OnInit {

  roles = Roles;
  permissions = Permissions;
  eventForm: FormGroup;
  actionCtrl: FormControl;
  detailCtrl: FormControl;
  reportId: string;
  siret: string;
  actions: ReportEventAction[];

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;
  activationDocumentUrl: string;

  constructor(public formBuilder: FormBuilder,
              public bsModalRef: BsModalRef,
              private eventService: EventService,
              private constantService: ConstantService,
              private accountService: AccountService,
              private authenticationService: AuthenticationService,
              private platformLocation: PlatformLocation) { }

  ngOnInit() {
    this.loading = true;
    this.loadingError = false;
    this.platformLocation.onPopState(() => {
      if (this.bsModalRef) {
        this.bsModalRef.hide();
      }
    });
    combineLatest(
      this.constantService.getActions(),
      this.accountService.getActivationDocumentUrl(this.siret)
    ).subscribe(
      ([actions, url]) => {
        this.loading = false;
        this.actions = actions;
        this.activationDocumentUrl = url;
        this.initEventForm();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });

  }

  initEventForm() {
    this.actionCtrl = this.formBuilder.control('', Validators.required);
    this.detailCtrl = this.formBuilder.control('');

    this.eventForm = this.formBuilder.group({
      action: this.actionCtrl,
      detail: this.detailCtrl
    });

  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  submitEventForm() {
    if (!this.eventForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.loadingError = false;

      this.authenticationService.user.pipe(
        switchMap(user => {
          const eventToCreate = Object.assign(new ReportEvent(), {
            reportId: this.reportId,
            eventType: user.role === Roles.DGCCRF ? 'DGCCRF' : 'PRO',
            action: this.actionCtrl.value,
            details: {description: this.detailCtrl.value}
          });

          return this.eventService.createEvent(eventToCreate);
        })
      ).subscribe(
        event => {
          this.bsModalRef.hide();
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
    }
  }

  isActionEnvoiCourrier() {
    return this.actions.find(a => a === this.actionCtrl.value)
      && this.actions.find(a => a === this.actionCtrl.value).name === `Envoi d'un courrier`;
  }

}

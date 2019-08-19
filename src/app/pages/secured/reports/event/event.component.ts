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
  resultActionCtrl: FormControl;
  reportId: string;
  siret: string;
  actionPros: ReportEventAction[];
  actionProFinals: string[];
  actionConsos: ReportEventAction[];
  actionAgents: ReportEventAction[];
  allActions: ReportEventAction[];

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;
  activationDocumentUrl: string;

  constructor(public formBuilder: FormBuilder,
              public bsModalRef: BsModalRef,
              private eventService: EventService,
              private constantService: ConstantService,
              private accountService: AccountService,
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
      this.constantService.getActionPros(),
      this.constantService.getActionProFinals(),
      this.constantService.getActionConsos(),
      this.constantService.getActionAgents(),
      this.accountService.getActivationDocumentUrl(this.siret)
    ).subscribe(
      ([actionPros, actionProFinals, actionConsos, actionAgents, url]) => {
        this.loading = false;
        this.actionPros = actionPros;
        this.actionProFinals = actionProFinals.map(action => action.name);
        this.actionConsos = actionConsos;
        this.actionAgents = actionAgents;
        this.allActions = [...this.actionPros, ...this.actionConsos, ...this.actionAgents];
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
    this.resultActionCtrl = this.formBuilder.control(true, Validators.required);

    this.eventForm = this.formBuilder.group({
      action: this.actionCtrl,
      detail: this.detailCtrl
    });

    // Fix pour Safari/IE 11 (voir fonction fixDefaultSelectedOpionOnSafariAndIE)
    //this.eventForm.controls.action.setValue("-1");

  }

  isStatusProFinal(status: string) {
    return this.actionProFinals.indexOf(status) !== -1;
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  // Fix pour Safari/IE 11 : le 1er élément du select n'a pas d'input action
  // fixDefaultSelectedOpionOnSafariAndIE(eventToCreate) {
  //   if (eventToCreate.action === "-1") {
  //     if (this.user && this.user.role === Roles.DGCCRF) {
  //       eventToCreate.action = this.actionAgents && this.actionAgents.length ? this.actionAgents[0] : undefined;
  //     }
  //     else if (this.user && this.user.role == Roles.Admin) {
  //       eventToCreate.action = this.actionPros && this.actionPros.length ? this.actionPros[0] : undefined;
  //     }
  //   }
  // }

  submitEventForm() {
    if (!this.eventForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.loadingError = false;
      const eventToCreate = Object.assign(new ReportEvent(), {
        reportId: this.reportId,
        eventType: this.actionPros.find(a => a === this.actionCtrl.value) ? 'PRO' : 'CONSO',
        action: this.actionCtrl.value,
        detail: this.detailCtrl.value
      });
      if (this.actionCtrl.value.withResult) {
        eventToCreate.resultAction = this.resultActionCtrl.value;
      }

      // this.fixDefaultSelectedOpionOnSafariAndIE(eventToCreate);

      this.eventService.createEvent(eventToCreate).subscribe(
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

  selectAction() {

    if (this.allActions.find(action => action === this.actionCtrl.value).withResult) {
      this.eventForm.addControl('resultAction', this.resultActionCtrl);
    } else {
      this.eventForm.removeControl('resultAction');
    }
  }

  isActionEnvoiCourrier() {
    return this.actionPros.find(a => a === this.actionCtrl.value)
      && this.actionPros.find(a => a === this.actionCtrl.value).name === `Envoi d'un courrier`;
  }

}

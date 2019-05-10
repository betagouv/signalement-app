import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../../services/event.service';
import { ReportEvent, ReportEventAction } from '../../../../model/ReportEvent';
import { AuthenticationService } from '../../../../services/authentication.service';
import { User } from '../../../../model/AuthUser';
import { BsModalRef } from 'ngx-bootstrap';
import { ConstantService } from '../../../../services/constant.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss', '../../../../app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EventComponent implements OnInit {

  eventForm: FormGroup;
  actionCtrl: FormControl;
  detailCtrl: FormControl;
  resultActionCtrl: FormControl;
  reportId: string;
  user: User;
  actionPros: ReportEventAction[];
  actionConsos: ReportEventAction[];

  showErrors: boolean;
  loading: boolean;

  constructor(public formBuilder: FormBuilder,
              public bsModalRef: BsModalRef,
              private eventService: EventService,
              private authenticationService: AuthenticationService,
              private constantService: ConstantService) { }

  ngOnInit() {
    this.initEventForm();
    combineLatest(
      this.authenticationService.user,
      this.constantService.getActionPros(),
      this.constantService.getActionConsos(),
    ).subscribe(
      ([user, actionPros, actionConsos]) => {
        this.user = user;
        this.actionPros = actionPros;
        this.actionConsos = actionConsos;
      }
    );
  }
  
  initEventForm() {
    this.actionCtrl = this.formBuilder.control('', Validators.required);
    this.detailCtrl = this.formBuilder.control('', Validators.required);
    this.resultActionCtrl = this.formBuilder.control(true, Validators.required);

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
      const eventToCreate = Object.assign(new ReportEvent(), {
        reportId: this.reportId,
        userId: this.user.id,
        eventType: this.actionPros.find(a => a === this.actionCtrl.value) ? 'PRO' : 'CONSO',
        action: this.actionCtrl.value,
        detail: this.detailCtrl.value
      });
      if (this.actionCtrl.value.resultAction) {
        eventToCreate.resultAction = this.resultActionCtrl.value;
      }
      this.eventService.createEvent(eventToCreate).subscribe( event => {
        this.bsModalRef.hide();
        this.loading = false;
        }
      );
    }
  }

  selectAction() {
    if ([...this.actionPros, ...this.actionConsos].find(action => action.name === this.actionCtrl.value).withResult) {
      this.eventForm.addControl('resultAction', this.resultActionCtrl);
    } else {
      this.eventForm.removeControl('resultAction');
    }
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../../services/event.service';
import { ReportEvent } from '../../../../model/ReportEvent';
import { AuthenticationService } from '../../../../services/authentication.service';
import { User } from '../../../../model/AuthUser';
import { BsModalRef } from 'ngx-bootstrap';
import { ConstantService } from '../../../../services/constant.service';

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
  reportId: string;
  user: User;
  actionPros: string[];

  showErrors: boolean;
  loading: boolean;

  constructor(public formBuilder: FormBuilder,
              public bsModalRef: BsModalRef,
              private eventService: EventService,
              private authenticationService: AuthenticationService,
              private constantService: ConstantService) { }

  ngOnInit() {
    this.initEventForm();
    this.authenticationService.user.subscribe(user => this.user = user);
    this.constantService.getActionPros().subscribe(actionPros => this.actionPros = actionPros);
  }
  
  initEventForm() {
    this.actionCtrl = this.formBuilder.control('', Validators.required);
    this.detailCtrl = this.formBuilder.control('', Validators.required);

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
      this.eventService.createEvent(Object.assign(new ReportEvent(), {
        reportId: this.reportId,
        userId: this.user.id,
        eventType: 'PRO',
        action: this.actionCtrl.value,
        detail: this.detailCtrl.value
      })).subscribe( event => {
        this.bsModalRef.hide();
        this.loading = false;
        }
      );
    }
  }

}

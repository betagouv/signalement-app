import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css', '../../../../app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EventComponent implements OnInit {

  eventForm: FormGroup;
  actionCtrl: FormControl;
  detailCtrl: FormControl;
  eventActions = Object.values(EventActions);

  showErrors: boolean;
  notYet: boolean;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initEventForm();
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
      this.notYet = true;
    }
  }

}

export enum EventActions {
  'HORS-PERIMETRE' = 'Hors périmètre',
  'A-CONTACTER' = 'A contacter',
  'CONTACT-TEL' = 'Appel téléphonique',
  'CONTACT-EMAIL' = 'Envoi d\'un email',
  'CONTACT-COURRIER' = 'Envoi d\'un courrier',
  'REPONSE-PRO-CONTACT' = 'Réponse du professionnel au contact',
  'ENVOI-SIGNALEMENT' = 'Envoi du signalement',
  'REPONSE-PRO-SIGNALEMENT' = 'Réponse du professionnel au signalement'
}

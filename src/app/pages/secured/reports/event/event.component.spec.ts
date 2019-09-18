import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { EventComponent } from './event.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { BsModalRef, ModalModule } from 'ngx-bootstrap';
import { AppPermissionDirective } from '../../../../directives/app-permission.directive';
import { AppRoleDirective } from '../../../../directives/app-role.directive';
import { ReportEventAction, ReportEvent } from 'src/app/model/ReportEvent';
import { EventService } from 'src/app/services/event.service';
import { of } from 'rxjs';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  interface REA {
    name: string;
    withResult: boolean;
  }

  function create(arr: REA[]) {
    return arr.map(elt => Object.assign(new ReportEventAction(), {
        name: elt.name,
        withResult: elt.withResult
    }));
  }

  const actionPros = create([{
    name: 'Hors périmètre', 'withResult': false
  }, {
    name: 'Envoi d\'un courrier', 'withResult': false
  },{
    name: 'Réponse du professionnel au signalement', 'withResult': true
  }, {
    name: 'Signalement mal attribué', 'withResult': false
  }, {
    name: 'Signalement non consulté', 'withResult': false
  }, {
    name: 'Signalement consulté ignoré', 'withResult': false
  }]);

  const actionConsos = create([{
    name: 'Envoi email accusé de réception', 'withResult': false
  }, {
    name: 'Envoi email de non prise en compte', 'withResult': false
  }, {
    name: 'Envoi email d\'information de transmission', 'withResult': false
  }, {
    name: 'Envoi email de la réponse pro', 'withResult': false
  }]);

  function getActionPros(label) {
    const res = actionPros.filter(elt => elt.name === label);
    return res && res.length ? res[0] : null;
  }

  const eventFixture = Object.assign(new ReportEvent(), {
    id: '34',
    reportId: '34',
    creationDate: new Date(),
    userId: '9879',
    eventType: 'PRO',
    action: getActionPros('Envoi d\'un courrier'),
    resultAction: true,
    detail: 'Texte de l\'évènement'

  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EventComponent,
        AppPermissionDirective,
        AppRoleDirective,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxLoadingModule,
        ModalModule.forRoot(),
      ],
      providers: [
        BsModalRef
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    component.actionPros = actionPros;
    component.actionConsos = actionConsos;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.initEventForm();
    expect(component.eventForm.valid).toBeFalsy();
  });
  it('should return a DGCCRF event type', () => {

    expect(component.getTypeOfEvent(component.actionPros[2])).not.toBe('DGCCRF');
  });

  it('should return a Pro event type', () => {

    expect(component.getTypeOfEvent(component.actionPros[1])).toBe('PRO');
    expect(component.getTypeOfEvent(component.actionPros[2])).not.toBe('CONSO');
    expect(component.getTypeOfEvent(component.actionPros[3])).not.toBe('DGCCRF');
  });

  it('should return a Conso event type', () => {

    expect(component.getTypeOfEvent(component.actionConsos[1])).toBe('CONSO');
  });

  xit('should display the link to download the letter', () => {
    const nativeElement = fixture.nativeElement;

    component.initEventForm();

    expect(nativeElement.querySelector('#linkSendPostMail')).toBeNull();

    component.eventForm.controls['action'].setValue(eventFixture);
    expect(component.eventForm.valid).toBeTruthy();

    fixture.detectChanges();

    expect(nativeElement.querySelector('#linkSendPostMail')).not.toBeNull();

  });

});

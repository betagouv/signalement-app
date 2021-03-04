import { Component, Input } from '@angular/core';
import { Report } from '../../../model/Report';

@Component({
  selector: 'app-report-card[report]',
  host: {
    '[class.hoverable]': 'true',
  },
  styleUrls: ['./report-card-pro.component.scss'],
  template: `
    <div class="-root" [routerLink]="['/suivi-des-signalements', 'report', report.id]">
      <div class="-body">
        <div class="-head" *ngIf="!hideCompany">
          <span class="-company">{{report.company?.siret}}</span>
          <mat-icon class="-icon-small -icon-dash">remove</mat-icon>
          <mat-icon class="-icon-small txt-disabled">location_on</mat-icon>
          <span class="-location">{{report.company?.postalCode}}</span>
        </div>
        <span class="-consumer">
          Le {{report.creationDate | date : 'dd/MM/yyyy' }}<br/>
          {{report.contactAgreement ? ' par ' + report.consumer.firstName + ' ' + report.consumer.lastName : '(Signalement anonyme)'}}
        </span>
      </div>
      <mat-icon aria-hidden="true" title="Pièces jointes" *ngIf="report.consumerUploadedFiles.length" class="-attachment">
        attach_file
      </mat-icon>
      <app-badge-status [status]="report.status"></app-badge-status>
    </div>
  `
})
export class ReportCardProComponent {

  @Input() report!: Report;

  @Input() hideCompany = true;
}


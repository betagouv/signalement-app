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
        <div class="-head">
          <app-badge-status [status]="report.status"></app-badge-status>
          <div class="-title" *ngIf="!hideCompany">{{report.company?.siret}}</div>
          <mat-icon aria-hidden="true" title="Pièces jointes" *ngIf="report.consumerUploadedFiles.length" class="-attachment txt-secondary">
            attach_file
          </mat-icon>
        </div>
        <div class="-row" *ngIf="!hideCompany">
          <mat-icon class="-row_icon">location_on</mat-icon>
          <div class="-row_label">Code postal</div>
          {{report.company?.postalCode}}
        </div>
        <div class="-row">
          <mat-icon class="-row_icon">event</mat-icon>
          <div class="-row_label">Date de réception</div>
          {{report.creationDate | date : 'dd/MM/yyyy' }}
        </div>
        <div class="-row">
          <mat-icon class="-row_icon">person</mat-icon>
          <div class="-row_label">Consommateur</div>
          {{report.contactAgreement ? report.consumer.firstName + ' ' + report.consumer.lastName : 'Signalement anonyme'}}
        </div>
      </div>
      <mat-icon>keyboard_arrow_right</mat-icon>
    </div>
  `
})
export class ReportCardProComponent {

  @Input() report!: Report;

  @Input() hideCompany = true;
}


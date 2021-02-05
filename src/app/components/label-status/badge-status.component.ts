import { Component, Input } from '@angular/core';
import { ReportStatus, reportStatusColor } from '../../model/Report';

@Component({
  selector: 'app-badge-status[status]',
  template: `
    <app-badge style="background-color: {{statusColor[status]}}" attr.aria-label="Statut du signalement">
      {{status}}
    </app-badge>
  `
})
export class BadgeStatusComponent {

  readonly statusColor = reportStatusColor;

  @Input() status!: ReportStatus;
}

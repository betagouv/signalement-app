import { Component, Input } from '@angular/core';
import { ReportStatus, reportStatusColor } from '../../model/Report';

@Component({
  selector: 'app-badge-status[status]',
  styleUrls: ['./badge-status.component.scss'],
  host: {
    '[style.background-color]': 'statusColor[status]',
  },
  template: `
    {{status}}
  `
})
export class BadgeStatusComponent {

  readonly statusColor = reportStatusColor;

  @Input() status!: ReportStatus;
}

import { Component, Input } from '@angular/core';
import { ReportStatus, reportStatusColor } from '../../model/Report';

@Component({
  selector: 'app-label-status[status]',
  styleUrls: ['./label-status.component.scss'],
  host: {
    '[style.background-color]': 'statusColor[status]',
  },
  template: `
    {{status}}
  `
})
export class LabelStatusComponent {

  readonly statusColor = reportStatusColor;

  @Input() status!: ReportStatus;
}

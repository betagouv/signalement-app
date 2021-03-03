import { Component } from '@angular/core';
import { AnomalyService } from '../../services/anomaly.service';

@Component({
  selector: 'app-anomalies-tree',
  template: `
    <app-banner title="Arborescence du dépot d'un signalement"></app-banner>
    <app-page>
      <mat-tree

    </app-page>
  `,
  styleUrls: ['./anomalies-tree.component.scss']
})
export class AnomaliesTreeComponent {

  constructor(anomalyService: AnomalyService) {
    console.log(anomalyService.getAnomalies());
  }
}

import { Component } from '@angular/core';
import { AnomalyService } from '../../services/anomaly.service';

@Component({
  selector: 'app-anomalies-tree',
  template: `
    <app-banner title="Arborescence du dépot d'un signalement"></app-banner>
    <app-page>
      <!--      Really slow feature but may be wanted one day -->
      <!--      <button mat-icon-button (click)="openAll = !openAll" color="primary">-->
      <!--        <mat-icon>unfold_more</mat-icon>-->
      <!--      </button>-->
      <app-anomalies-node *ngFor="let anomaly of anomalies" [anomaly]="anomaly" [openAll]="openAll"></app-anomalies-node>
    </app-page>
  `,
  styleUrls: ['./anomalies-tree.component.scss']
})
export class AnomaliesTreeComponent {

  constructor(private anomalyService: AnomalyService) {
  }

  openAll = false;

  readonly anomalies = this.anomalyService.getAnomalies();
}

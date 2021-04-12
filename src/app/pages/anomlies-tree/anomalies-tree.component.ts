import { Component } from '@angular/core';
import { AnomalyService } from '../../services/anomaly.service';

@Component({
  selector: 'app-anomalies-tree',
  template: `
    <app-banner title="Arborescence du dépot d'un signalement"></app-banner>
    <app-page pageDefinitionKey="anomaly">
      <button mat-raised-button (click)="toggleAll()" [disabled]="disabledToggleAll" color="primary">
        <mat-icon>{{openAll ? 'unfold_less' : 'unfold_more'}}</mat-icon>
        {{openAll ? 'Tout replier' : 'Tout déplier'}}
      </button>
      <br/>
      <br/>
      <app-anomalies-node
        *ngFor="let anomaly of anomalies"
        [anomaly]="anomaly"
        [openAll]="openAll"
        [hidden]="anomaly.hidden"></app-anomalies-node>
    </app-page>
  `,
  styleUrls: ['./anomalies-tree.component.scss']
})
export class AnomaliesTreeComponent {

  constructor(private anomalyService: AnomalyService) {
  }

  openAll = false;

  disabledToggleAll = false;

  readonly toggleAll = () => {
    // Prevent spaming because it's a really slow feature !
    this.disabledToggleAll = true;
    setTimeout(() => {
      this.openAll = !this.openAll;
    });
    setTimeout(() => {
      this.disabledToggleAll = false;
    }, 1000);
  };

  readonly anomalies = this.anomalyService.getAnomalies();
}

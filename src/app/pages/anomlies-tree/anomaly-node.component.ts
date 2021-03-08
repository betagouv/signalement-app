import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  Anomaly,
  instanceOfAnomaly,
  instanceOfSubcategoryInformation,
  instanceOfSubcategoryInput,
  SubcategoryBase,
  SubcategoryInformation,
  SubcategoryInput
} from '../../model/Anomaly';
import { slideToggle } from '../../utils/animations';

@Component({
  selector: 'app-anomalies-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button color="primary" (click)="isOpen = !isOpen" class="-toggle-button" [disabled]="!hasMore()">
      <mat-icon>{{hasMore() ? isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right' : 'remove'}}</mat-icon>
    </button>
    <div class="-content">
      <div class="-header">
        <div>
          <div class="-title">{{title}}</div>
          <div class="-desc" *ngIf="anomaly.description" [innerHTML]="anomaly.description"></div>
          <div class="-desc" *ngIf="anomaly.subcategoriesTitle" [innerHTML]="anomaly.subcategoriesTitle"></div>
        </div>
      </div>
      <div class="-subcategory" *ngIf="isOpen" [@slideToggle]>
        <app-anomalies-node-info *ngIf="isSubcategoryInformation()" [anomaly]="anomaly"></app-anomalies-node-info>
        <app-anomalies-node-inputs *ngIf="isSubcategoryInput()" [anomaly]="anomaly"></app-anomalies-node-inputs>
        <app-anomalies-node *ngFor="let _ of anomaly.subcategories" [anomaly]="_" [openAll]="openAll"></app-anomalies-node>
      </div>
    </div>
  `,
  styleUrls: ['./anomaly-node.component.scss'],
  animations: [slideToggle]
})
export class AnomaliesNodeComponent {

  @Input() anomaly: Anomaly | SubcategoryBase;

  private _openAll = false;

  @Input()
  set openAll(value: boolean) {
    this._openAll = value;
    this.isOpen = value;
  }

  get openAll() {
    return this._openAll;
  }

  get title() {
    if (instanceOfAnomaly(this.anomaly)) {
      return this.anomaly.category;
    }
    return this.anomaly.title;
  }

  isOpen = false;

  readonly isSubcategoryInput = () => instanceOfSubcategoryInput(this.anomaly);

  readonly isSubcategoryInformation = () => instanceOfSubcategoryInformation(this.anomaly);

  readonly hasMore = () => this.anomaly.subcategories?.length > 0 || this.isSubcategoryInformation() || this.isSubcategoryInput();
}


@Component({
  selector: 'app-anomalies-node-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    {{anomaly.information}}
  `,
})
export class AnomaliesNodeInfoComponent {

  @Input() anomaly: SubcategoryInformation;
}


@Component({
  selector: 'app-anomalies-node-inputs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [innerHTML]="anomaly.detailTitle"></div>
    <div>
      <div *ngFor="let input of anomaly.detailInputs" style="margin-bottom: 16px">
        <div [innerHTML]="input.label"></div>
        <ng-container [ngSwitch]="input.type">
          <ng-container *ngSwitchCase="'RADIO'">
            <mat-radio-button *ngFor="let options of input.options" disabled class="d-block" style="margin: 0">
              {{options}}
            </mat-radio-button>
          </ng-container>
          <ng-container *ngSwitchCase="'CHECKBOX'">
            <mat-checkbox *ngFor="let options of input.options" disabled class="d-block">
              {{options}}
            </mat-checkbox>
          </ng-container>
          <ng-container *ngSwitchDefault>
            <input class="form-control form-control-material" disabled [placeholder]="input.placeholder || ''">
          </ng-container>
        </ng-container>
      </div>
      <input *ngIf="anomaly.fileLabel" class="form-control form-control-material" disabled [placeholder]="anomaly.fileLabel">
    </div>
  `,
})
export class AnomaliesNodeInputsComponent {

  @Input() anomaly: SubcategoryInput;
}

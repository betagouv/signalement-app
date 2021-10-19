import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Animations } from '../../utils/animations';
import { Anomaly, AnomalyClient, SubcategoryBase, SubcategoryInformation, SubcategoryInput } from '@signal-conso/signalconso-api-sdk-js';

@Component({
  selector: 'app-anomalies-node[anomaly]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button color="primary" (click)="isOpen = !isOpen" class="-toggle-button" [disabled]="!hasMore()">
      <mat-icon>{{hasMore() ? isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right' : 'remove'}}</mat-icon>
    </button>
    <div class="-content">
      <div class="-header">
        <div>
          <div class="-title">
            {{title}}
            <span class="txt-secondary">{{anomaly.id}}</span>
            &nbsp;
            <app-badge *ngFor="let tag of tags">{{tag}}</app-badge>
          </div>
          <div class="-desc" *ngIf="anomaly.description" [innerHTML]="anomaly.description"></div>
          <div class="-desc" *ngIf="anomaly.subcategoriesTitle" [innerHTML]="anomaly.subcategoriesTitle"></div>
          <div class="-desc" *ngIf="reponseconsoCodes && reponseconsoCodes.length > 0">
            ReponseConso codes:
            <span class="-reponseconso-code" *ngFor="let code of reponseconsoCodes">
              {{code}}
            </span>
          </div>
        </div>
      </div>
      <div class="-subcategory" *ngIf="isOpen" @slideToggleNgIf>
        <app-anomalies-node-info *ngIf="isSubcategoryInformation()" [anomaly]="anomaly"></app-anomalies-node-info>
        <app-anomalies-node-inputs *ngIf="isSubcategoryInput()" [anomaly]="anomaly"></app-anomalies-node-inputs>
        <app-anomalies-node *ngFor="let _ of anomaly.subcategories" [anomaly]="_" [openAll]="openAll"></app-anomalies-node>
      </div>
    </div>
  `,
  styleUrls: ['./anomaly-node.component.scss'],
  animations: [Animations.slideToggleNgIf]
})
export class AnomaliesNodeComponent {

  @Input() anomaly!: Anomaly | SubcategoryBase;

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
    if (AnomalyClient.instanceOfAnomaly(this.anomaly)) {
      return this.anomaly.category;
    }
    return this.anomaly.title;
  }

  get tags(): string[] | undefined {
    return (this.anomaly as SubcategoryBase).tags;
  }

  get reponseconsoCodes(): string[] | undefined {
    return (this.anomaly as SubcategoryBase).reponseconsoCode;
  }

  isOpen = false;

  readonly isSubcategoryInput = () => AnomalyClient.instanceOfSubcategoryInput(this.anomaly);

  readonly isSubcategoryInformation = () => AnomalyClient.instanceOfSubcategoryInformation(this.anomaly);

  readonly hasMore = () => (this.anomaly.subcategories || []).length > 0 || this.isSubcategoryInformation() || this.isSubcategoryInput();
}


@Component({
  selector: 'app-anomalies-node-info[anomaly]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="anomaly.information.title" [innerHTML]="anomaly.information.title"></div>
    <div *ngIf="anomaly.information.subTitle" [innerHTML]="anomaly.information.subTitle"></div>
    <div *ngIf="anomaly.information.content" [innerHTML]="anomaly.information.content" class="txt-small txt-secondary"></div>
    <ul *ngIf="anomaly.information.actions" class="txt-small">
      <li *ngFor="let action of anomaly.information.actions">
        <div [innerHTML]="action.question" class="font-weight-bold"></div>
        <div [innerHTML]="action.example"></div>
        <div [innerHTML]="action.answer"></div>
      </li>
    </ul>
    <div class="txt-info" *ngIf="anomaly.information.outOfScope">
      Nous ne doutons pas que vous ayez réellement rencontré un problème mais... il ne s’agit pas d’une fraude.
    </div>
  `,
})
export class AnomaliesNodeInfoComponent {

  @Input() anomaly!: SubcategoryInformation;
}


@Component({
  selector: 'app-anomalies-node-inputs[anomaly]',
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

  @Input() anomaly!: SubcategoryInput;
}

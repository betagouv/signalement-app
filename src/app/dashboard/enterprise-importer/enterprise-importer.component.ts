import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CancelEtablissementFileService,
  CancelUniteLegaleFileService,
  EnterpriseImporterServiceInfoService,
  StartEtablissementFileService,
  StartUniteLegaleFileService
} from '../../services/enterprise-importer.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EnterpriseImporterInfo } from '../../api-sdk/model/EnterpriseImporter';
import { of, timer } from 'rxjs';
import { formatDistance } from 'date-fns';


@Component({
  selector: 'app-enterprise-importer-file',
  template: `
    <div class="mr-2">
      <button *ngIf="!info || info.endedAt" mat-icon-button color="primary" (click)="start.emit()">
        <span class="material-icons">play_arrow</span>
      </button>
      <button *ngIf="info && !info.endedAt" mat-icon-button color="warn" (click)="cancel.emit()">
        <span class="material-icons">stop</span>
      </button>
    </div>
    <div>
      <div class="txt-big">{{name}}</div>
      <a [href]="url">{{url}}</a>
      <ng-container *ngIf="info && !info.endedAt">
        <mat-progress-bar [value]="percent" class="mt-1 mb-1"></mat-progress-bar>
        <div class="-hint">
          <span class="font-weight-bold">{{percent| number:'1.0-0'}}%</span>
          <span>{{info.linesDone | number}} <span class="txt-secondary">/ {{info.linesCount | number}}</span></span>
        </div>
        <div class="-hint">
          {{elapsedTime()}}
        </div>
      </ng-container>
      <div *ngIf="info?.endedAt">
        {{info.endedAt}}
      </div>
      <div *ngIf="info?.errors" class="txt-error">
        {{info.errors}}
      </div>
    </div>
  `,
  styleUrls: ['./enterprise-importer-file.component.scss']
})
export class EnterpriseImporterFileComponent {

  @Input() url: string;

  @Input() name: string;

  @Input() info?: EnterpriseImporterInfo;

  @Output() start = new EventEmitter<void>();

  @Output() cancel = new EventEmitter<void>();

  get percent() {
    return (this.info.linesDone / this.info.linesCount * 100) || 0;
  }

  elapsedTime = () => {
    console.log(this.info.startedAt);
    try {
      console.log(formatDistance(this.info.startedAt, new Date(), { addSuffix: true }));
      return formatDistance(this.info.startedAt, new Date(), { addSuffix: true });
    } catch (e) {
      return 'Date invalide: ' + this.info.startedAt;
    }
  };

}

@Component({
  selector: 'app-enterprise-importer',
  template: `
    <app-banner title="Gestion de la base de données entreprises"></app-banner>

    <app-page pageDefinitionKey="enterprisesImport" size="small">
      <app-panel>
        <app-panel-header>
          <button mat-raised-button color="primary" (click)="stopAll()">
            Tout stopper
          </button>
        </app-panel-header>
        <app-panel-body>
          <app-enterprise-importer-file
            class="mb-4"
            name="StockEtablissement_utf8"
            url="https://files.data.gouv.fr/insee-sirene/StockEtablissement_utf8.zip"
            [info]="etablissementInfo$ | async"
            (start)="startEtablissementFile()"
            (cancel)="cancelEtablissementFile()"
          ></app-enterprise-importer-file>

          <app-enterprise-importer-file
            name="StockUniteLegale_utf8"
            url="https://files.data.gouv.fr/insee-sirene/StockUniteLegale_utf8.zip"
            [info]="uniteLegaleInfo$ | async"
            (start)="startUniteLegaleFile()"
            (cancel)="cancelUniteLegaleFile()"
          ></app-enterprise-importer-file>
        </app-panel-body>
      </app-panel>
    </app-page>
  `,
  styleUrls: ['./enterprise-importer.component.scss']
})
export class EnterpriseImporterComponent {

  constructor(
    public enterpriseImporterServiceInfoService: EnterpriseImporterServiceInfoService,
    public cancelEtablissementFileService: CancelEtablissementFileService,
    public startEtablissementFileService: StartEtablissementFileService,
    public startUniteLegaleFileService: StartUniteLegaleFileService,
    public cancelUniteLegaleFileService: CancelUniteLegaleFileService,
  ) {
  }


  readonly startEtablissementFile = () => this.startEtablissementFileService.list().subscribe();

  readonly cancelEtablissementFile = () => this.cancelEtablissementFileService.list().subscribe();

  readonly startUniteLegaleFile = () => this.startUniteLegaleFileService.list().subscribe();

  readonly cancelUniteLegaleFile = () => this.cancelUniteLegaleFileService.list().subscribe();

  readonly info$ = timer(0, 4000).pipe(
    mergeMap(() => this.enterpriseImporterServiceInfoService.list({ clean: false })),
    catchError(_ => {
      console.error(_);
      return of({
        etablissementImportInfo: undefined,
        uniteLegaleInfo: undefined,
      });
    }),
  );

  readonly etablissementInfo$ = this.info$.pipe(map(_ => _.etablissementImportInfo));

  readonly uniteLegaleInfo$ = this.info$.pipe(map(_ => _.uniteLegaleInfo));

  readonly stopAll = () => {
    this.cancelUniteLegaleFile();
    this.cancelEtablissementFile();
  };
}

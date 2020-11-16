import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import oldCategories from '../../../../../assets/data/old-categories.json';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AnomalyService } from '../../../../services/anomaly.service';
import { Tag } from '../../../../model/Anomaly';
import { ConstantService } from '../../../../services/constant.service';
import { Regions } from '../../../../model/Region';
import { ReportFilter } from '../../../../model/ReportFilter';
import { reportStatusColor, reportStatusIcon } from '../../../../model/Report';
import { ReportService } from '../../../../services/report.service';

@Component({
  selector: 'app-report-list-search',
  template: `
    <div class="search-input-group" [formGroup]="searchForm">
      <input formControlName="details" (keyup.enter)="search()" class="input-invisible"
             placeholder="Rechercher dans les colonnes problème et description...">

      <div class="txt-secondary nowrap">
        <button mat-icon-button (click)="extracted.emit()" matTooltip="Exporter en XLS">
          <mat-icon>get_app</mat-icon>
        </button>
        <button mat-icon-button (click)="cleared.emit()">
          <mat-icon>clear</mat-icon>
        </button>
        <button mat-icon-button (click)="openPanel()">
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
      </div>

      <div *ngIf="isPanelOpen" class="panel-backdrop" (click)="closePanel()"></div>
      <div class="search-dialog" [@togglePanel]="isPanelOpen ? 'open' : 'closed'">
        <table class="form">
          <tr>
            <td><label for="rls-departments">Département(s)</label></td>
            <td>
              <app-select-departments formControlName="departments" id="rls-departments" class="form-control"></app-select-departments>
            </td>
          </tr>
          <tr>
            <td><label for="rls-siret">SIRET</label></td>
            <td>
              <input formControlName="siret" id="rls-siret" class="form-control">
            </td>
          </tr>
          <tr>
            <td><label for="rls-email">Email conso.</label></td>
            <td>
              <input formControlName="email" id="rls-email" class="form-control">
            </td>
          </tr>
          <tr>
            <td><label for="rls-statut">Statut</label></td>
            <td>
              <mat-select formControlName="status" id="rls-statut" class="form-control">
                <mat-select-trigger>{{searchForm.get('status').value}}</mat-select-trigger>
                <mat-option value="undefined" selected>Tous les statuts</mat-option>
                <mat-option *ngFor="let _ of statusList" [value]="_">
                  <mat-icon aria-hidden [ngStyle]="{'color': statusColor[_]}">{{statusIcon[_]}}</mat-icon>
                  {{_}}
                </mat-option>
              </mat-select>
            </td>
          </tr>
          <tr>
            <td><label for="rls-period">Période</label></td>
            <td>
<!--              <mat-form-field appearance="fill" id="rls-period">-->
<!--                <mat-label>Enter a date range</mat-label>-->
<!--                <mat-date-range-input [rangePicker]="picker">-->
<!--                  <input matStartDate formControlName="start" placeholder="Début">-->
<!--                  <input matEndDate formControlName="end" placeholder="Fin">-->
<!--                </mat-date-range-input>-->
<!--                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>-->
<!--                <mat-date-range-picker #picker></mat-date-range-picker>-->
<!--              </mat-form-field>-->
              <input
                id="rls-period"
                class="form-control"
                formControlName="period"
                bsDaterangepicker
                autocomplete="off"
                [bsConfig]="{ containerClass: 'theme-default', rangeInputFormat: 'DD MMMM YYYY' }"
                triggers="click keypress"
              />
            </td>
          </tr>
          <tr>
            <td><label>Tags</label></td>
            <td>
              <mat-select formControlName="tags" class="form-control" multiple>
                <mat-option *ngFor="let _ of tags" [value]="_">{{_}}</mat-option>
              </mat-select>
            </td>
          </tr>
          <tr>
            <td>
              <label for="rls-category">Catégorie</label>
            </td>
            <td>
              <mat-select formControlName="category" id="rls-category" class="form-control">
                <mat-option>Toutes les catégories</mat-option>
                <mat-option *ngFor="let _ of categories" value="_">{{_}}</mat-option>
              </mat-select>
            </td>
          </tr>
          <tr>
            <td><label>Entreprise identifiée ?</label></td>
            <td>
              <mat-radio-group formControlName="hasCompany">
                <mat-radio-button value="true">Oui</mat-radio-button>
                <mat-radio-button value="false">Non</mat-radio-button>
                <mat-radio-button>Indifférent</mat-radio-button>
              </mat-radio-group>
            </td>
          </tr>
        </table>

        <div class="actions">
          <button color="primary" mat-button (click)="closePanel()">Fermer</button>
          <button color="primary" mat-raised-button (click)="search()">Rechercher</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./report-list-filters.component.scss'],
  animations: [
    trigger('togglePanel', [
      state('open', style({
        opacity: 1,
      })),
      state('closed', style({
        opacity: 0,
        height: 0,
        'z-index': -1,
      })),
      transition('open => closed', [animate('160ms')]),
      transition('closed => open', [animate('160ms')]),
    ]),
  ]
})
export class ReportListFiltersComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private anomalyService: AnomalyService,
    private router: Router,
    private reportService: ReportService,
    private constantService: ConstantService,
  ) {
  }

  @Input() searchForm: FormGroup;

  @Output() searched = new EventEmitter<ReportFilter>();

  @Output() cleared = new EventEmitter();

  @Output() extracted = new EventEmitter();

  readonly statusIcon = reportStatusIcon;

  readonly statusColor = reportStatusColor;

  isPanelOpen = false;

  tags: Tag[];

  statusList: string[];

  categories: string[];

  regions = Regions;

  departments = this.regions.flatMap(_ => _.departments).map(_ => _.code);

  ngOnInit() {
    this.tags = this.anomalyService.getTags();
    this.constantService.getReportStatusList().subscribe(_ => this.statusList = _);
    this.categories = [
      ...this.anomalyService.getAnomalies().filter(anomaly => !anomaly.information).map(anomaly => anomaly.category),
      ...oldCategories
    ];
  }

  openPanel() {
    if (!this.isPanelOpen) {
      this.isPanelOpen = true;
    }
  }

  closePanel() {
    if (this.isPanelOpen) {
      this.isPanelOpen = false;
    }
  }

  search() {
    this.searched.emit();
    this.closePanel();
  }
}

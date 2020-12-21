import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import oldCategories from '../../../../../assets/data/old-categories.json';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AnomalyService } from '../../../../services/anomaly.service';
import { ConstantService } from '../../../../services/constant.service';
import { Regions } from '../../../../model/Region';
import { ReportFilter } from '../../../../model/ReportFilter';

@Component({
  selector: 'app-report-list-search',
  template: `
    <ng-container [formGroup]="searchForm">

      <app-select-departments
        placeholder="Département(s)" formControlName="departments" id="rls-departments"
        class="form-control form-control-material">
      </app-select-departments>
      <input
        class="form-control form-control-material"
        formControlName="period"
        bsDaterangepicker
        autocomplete="off"
        placeholder="Période sélectionnée"
        [bsConfig]="{ containerClass: 'theme-default', rangeInputFormat: 'DD MMMM YYYY' }"
        triggers="click keypress"
      />

      <div class="txt-secondary text-nowrap">
        <button mat-icon-button (click)="extracted.emit()" matTooltip="Exporter en XLS">
          <mat-icon>get_app</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Supprimer tous les filtres" (click)="cleared.emit()">
          <mat-icon>clear</mat-icon>
        </button>
        <button mat-raised-button [disabled]="isPanelOpen" color="primary" (click)="openPanel()">
          Filtres avancés
        </button>
      </div>

      <div *ngIf="isPanelOpen" class="panel-backdrop" (click)="closePanel()"></div>
      <div class="search-dialog" [@togglePanel]="isPanelOpen ? 'open' : 'closed'">
        <table class="form">
          <tr>
            <td><label for="rls-siret">SIRET</label></td>
            <td>
              <input formControlName="siret" id="rls-siret" class="form-control form-control-material">
            </td>
          </tr>
          <tr>
            <td><label for="rls-email">Email conso.</label></td>
            <td>
              <input formControlName="email" id="rls-email" class="form-control form-control-material">
            </td>
          </tr>
          <tr>
            <td><label for="rls-statut">Statut</label></td>
            <td>
              <mat-select formControlName="status" id="rls-statut" class="form-control form-control-material">
                <mat-select-trigger>{{searchForm.get('status').value}}</mat-select-trigger>
                <mat-option selected>Tous les statuts</mat-option>
                <mat-option *ngFor="let _ of statusList$ | async" [value]="_" class="mat-option-dense">
                  <app-badge-status [status]="_">{{_}}</app-badge-status>
                </mat-option>
              </mat-select>
            </td>
          </tr>
          <tr>
            <td>
              <label class="align-middle" for="rls-details">Mots-clés</label>
              &nbsp;
              <mat-icon class="align-middle txt-disabled" matTooltip="Recherche dans les colonnes problème et description">help_outline
              </mat-icon>
            </td>
            <td>
              <input id="details" class="form-control form-control-material" formControlName="details">
            </td>
          </tr>
          <tr>
            <td><label>Tags</label></td>
            <td>
              <mat-select formControlName="tags" class="form-control form-control-material" multiple>
                <mat-option *ngFor="let _ of tags" [value]="_">{{_}}</mat-option>
              </mat-select>
            </td>
          </tr>
          <tr>
            <td>
              <label for="rls-category">Catégorie</label>
            </td>
            <td>
              <mat-select formControlName="category" id="rls-category" class="form-control form-control-material">
                <mat-option>Toutes les catégories</mat-option>
                <mat-option *ngFor="let _ of categories" [value]="_">{{_}}</mat-option>
              </mat-select>
            </td>
          </tr>
          <tr>
            <td>
              <label for="rls-country">Pays étrangers</label>
            </td>
            <td>
              <input
                id="rls-country"
                class="form-control form-control-material"
                formControlName="companyCountries"
                appCountryDialog
                readonly
                style="cursor: pointer"
              />
            </td>
          </tr>
          <tr>
            <td><label>Entreprise identifiée ?</label></td>
            <td>
              <mat-radio-group formControlName="hasCompany">
                <mat-radio-button [value]="true">Oui</mat-radio-button>
                <mat-radio-button [value]="false">Non</mat-radio-button>
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
    </ng-container>
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
    private anomalyService: AnomalyService,
    private router: Router,
    private constantService: ConstantService,
  ) {
  }

  @Input() searchForm: FormGroup;

  @Output() searched = new EventEmitter<ReportFilter>();

  @Output() cleared = new EventEmitter();

  @Output() extracted = new EventEmitter();

  isPanelOpen = false;

  tags = this.anomalyService.getTags();

  statusList$ = this.constantService.getReportStatusList();

  categories: string[];

  regions = Regions;

  departments = this.regions.flatMap(_ => _.departments).map(_ => _.code);

  ngOnInit() {
    this.categories = [
      ...this.anomalyService.anomalies.filter(anomaly => !anomaly.information).map(anomaly => anomaly.category),
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

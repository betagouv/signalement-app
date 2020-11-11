import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import oldCategories from '../../../../../assets/data/old-categories.json';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReportFilter } from '../../../../model/ReportFilter';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Utils from '../../../../utils';
import { AnomalyService } from '../../../../services/anomaly.service';
import { Tag } from '../../../../model/Anomaly';
import { ConstantService } from '../../../../services/constant.service';
import { Region, Regions } from '../../../../model/Region';

@Component({
  selector: 'app-report-list-search',
  template: `
    <div class="input-group relative">
      {{filterForm.value|json}}
      <input [formControl]="searchInput" (keyup)="onKey($event)" type="text" class="form-control" placeholder="Rechercher signalements...">
      <div class="input-group-append">
        <div class="input-group-text" (click)="openPanel()">
          <span class="material-icons">arrow_drop_down</span>
        </div>
      </div>

      <div *ngIf="isPanelOpen" class="panel-backdrop" (click)="closePanel()"></div>
      <div class="search-dialog" [@togglePanel]="isPanelOpen ? 'open' : 'closed'" [formGroup]="filterForm">
        <table class="form">
          <tr>
            <td><label for="rls-departments">Département(s)</label></td>
            <td>
              <mat-select formControlName="departments" id="rls-departments" class="form-control" multiple>
                <mat-option class="select-option-group">Tous les départements</mat-option>
                <ng-container *ngFor="let region of regions">
                  <mat-option disabled class="select-optgroup" (click)="toggleRegion(region)">{{region.label}}</mat-option>
                  <mat-option class="mat-option-dense" *ngFor="let dep of region.departments" [value]="dep.code">
                    ({{dep.code}}) {{dep.label}}
                  </mat-option>
                </ng-container>
              </mat-select>
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
                <mat-option value="undefined" selected>Tous les statuts</mat-option>
                <mat-option *ngFor="let _ of statusList" [value]="_">{{_}}</mat-option>
              </mat-select>
            </td>
          </tr>
          <tr>
            <td><label for="rls-period">Période</label></td>
            <td>
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
            <td>
              <label for="rls-details">Mots-clés</label>
              &nbsp;&nbsp;
              <mat-icon class="txt-disabled" aria-hidden="true" matTooltip="Recherche dans les colonnes problème et description">
                help_outline
              </mat-icon>
            </td>
            <td>
              <input id="rls-details" formControlName="details" class="form-control"/>
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
          <button color="primary" mat-raised-button>Rechercher</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./report-list-search.component.scss'],
  animations: [
    trigger('togglePanel', [
      state('open', style({
        opacity: 1,
      })),
      state('closed', style({
        opacity: 0,
        height: 0,
      })),
      transition('open => closed', [animate('160ms')]),
      transition('closed => open', [animate('160ms')]),
    ]),
  ]
})
export class ReportListSearchComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private anomalyService: AnomalyService,
    private router: Router,
    private constantService: ConstantService,
  ) {
  }

  filterForm: FormGroup;

  isPanelOpen = true;

  searchInput = new FormControl();

  tags: Tag[];

  statusList: string[];

  categories: string[];

  regions = Regions;

  ngOnInit() {
    this.buildForm();
    this.tags = this.anomalyService.getTags();
    this.constantService.getReportStatusList().subscribe(_ => this.statusList = _);
    this.categories = [
      ...this.anomalyService.getAnomalies().filter(anomaly => !anomaly.information).map(anomaly => anomaly.category),
      ...oldCategories
    ];
  }

  buildForm = () => {
    const initialValues: ReportFilter = {
      tags: [],
      departments: [],
      details: undefined,
      period: undefined,
      siret: undefined,
      status: undefined,
      hasCompany: undefined,
      email: undefined,
      category: undefined,
      hasCompanyStr: '',
    };
    try {
      this.filterForm = this.fb.group({...initialValues, ...this.activatedRoute.snapshot.queryParams});
    } catch (e) {
      // Prevent error thrown by Angular when queryParams are wrong
      this.filterForm = this.fb.group(initialValues);
      console.warn('Query params seem invalid', e);
    }
    this.search(initialValues);
    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(this.search);
  };

  search = (report: ReportFilter) => {
    const cleanedReport = Utils.cleanObject(report) as ReportFilter | undefined;
    if (cleanedReport) {
      this.updateSearchForm(cleanedReport);
      this.updateQueryString(cleanedReport);
    }
  };

  allDepartmentsSelected = (r: Region) => r.departments.every(_ => this.safeDepartementInputValue.includes(_));
  allDeparmentsUnselected = (r: Region) => r.departments.every(_ => this.safeDepartementInputValue.includes(_));
  someDepartmentsSelected = (r: Region) => this.safeDepartementInputValue.some(_ => r.departments.includes(_));

  toggleRegion = (region: Region) => {
    const departments = region.departments.map(_ => _.code);
    if (departments.every(_ => this.safeDepartementInputValue.includes(_))) {
      this.removeRegion(region);
    } else if (this.safeDepartementInputValue.some(_ => departments.includes(_))) {
      this.selectRegion(region);
    } else {
      this.selectRegion(region);
    }
  };

  get safeDepartementInputValue() {
    return this.filterForm.get('departments').value || [];
  }

  private selectRegion = (region: Region) => {
    this.filterForm.get('departments')
      .patchValue(Utils.uniqueValues([...this.safeDepartementInputValue, ...region.departments.map(_ => _.code)]));
  };

  private removeRegion = (region: Region) => {
    const departments = region.departments.map(_ => _.code);
    this.filterForm
      .get('departments')
      .patchValue(this.safeDepartementInputValue.filter(dep => !departments.includes(dep)));
  };

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.filterForm.patchValue(JSON.parse(this.searchInput.value));
    }
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

  updateSearchForm = (values: ReportFilter) => {
    this.searchInput.patchValue(
      JSON.stringify(values)
      // .filter(([key, value]) => value !== undefined && value !== '')
      // .reduce((acc, [key, value]) => `${acc} ${key}:(${value})`, '')
    );
  };

  updateQueryString = (values: ReportFilter) => {
    this.router.navigate([], {queryParams: values, state: {}});
  };
}

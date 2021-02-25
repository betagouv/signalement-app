import { Component, HostBinding, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiSubscription } from '../../../api-sdk/model/ApiSubscription';
import { animate, style, transition, trigger } from '@angular/animations';
import { Country } from '../../../api-sdk/model/Country';
import { SelectDialogComponent } from './select-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionService } from '../../../services/subscription.service';
import { AnomalyService } from '../../../services/anomaly.service';
import { SelectDepartmentsDialogComponent } from './select-departments.component';
import { CompanySearchDialogComponent } from '../../companies/company-search-dialog/company-search-dialog.component';
import { CompanySearchResult } from '../../../model/Company';
import { MatSelectChange } from '@angular/material/select';

export const animation = `280ms cubic-bezier(0.35, 0, 0.25, 1)`;

@Component({
  selector: 'app-subscription-card[subscription]',
  template: `
    <app-panel [loading]="subscriptionService.updating(subscription.id)">
      <div class="-header">
        <h3 class="-title">Abonnement</h3>
        <button mat-button style="display: none"></button>
        <div class="-select form-control">
          <span>Fréquence</span>
          <mat-select class="-select_input" [value]="subscription.frequency" (selectionChange)="updateFrequency($event)"
                      placeholder="Fréquence">
            <mat-option value="P1D">Quotidienne</mat-option>
            <mat-option value="P7D">Hebdomadaire</mat-option>
          </mat-select>
        </div>
        <button
          mat-icon-button color="primary"
          appConfirm
          title="Supprimer l'abonnement ?"
          (confirmed)="remove()">
          <mat-icon>delete</mat-icon>
        </button>
      </div>

      <app-subscription-card-row icon="flag" label="Pays étranger" hoverable appCountryDialog [initialCountries]="countries"
                                 (countriesChanged)="updateCountry($event)">
        <mat-chip-list *ngIf="subscription.countries.length" class="-chip-wrapper">
          <mat-chip class="mat-chip-nohover" *ngFor="let _ of subscription.countries">
            {{_.name}}
          </mat-chip>
        </mat-chip-list>
        <span *ngIf="!subscription.countries.length">Tous</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="location_on" label="Départements" hoverable (click)="openDepartmentsDialog()">
        <mat-chip-list *ngIf="subscription.departments.length" class="-chip-wrapper">
          <mat-chip class="mat-chip-nohover" *ngFor="let _ of subscription.departments">
            {{_.code}} - {{_.label}}
          </mat-chip>
        </mat-chip-list>
        <span *ngIf="!subscription.departments.length">Tous</span>
      </app-subscription-card-row>

      <app-subscription-card-row
        icon="dashboard" label="Catégories" hoverable
        (click)="openDialog(anomalyService.getCategories(), 'categories')">
        <mat-chip-list *ngIf="subscription.categories.length" class="-chip-wrapper">
          <mat-chip class="mat-chip-nohover" *ngFor="let _ of subscription.categories">
            {{_}}
          </mat-chip>
        </mat-chip-list>
        <span *ngIf="!subscription.categories.length">Toutes</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="business" label="Entreprises">
        <span *ngIf="!subscription.sirets.length">Toutes&nbsp;&nbsp;</span>
        <mat-chip-list class="-chip-wrapper">
          <mat-chip *ngFor="let _ of subscription.sirets" [removable]="true" (removed)="removeCompany(_)">
            {{_}}
            <mat-icon matChipRemove *ngIf="true">cancel</mat-icon>
          </mat-chip>
          <mat-chip (click)="openCompaniesDialog()" class="color-primary">
            <mat-icon>add</mat-icon>
          </mat-chip>
        </mat-chip-list>
      </app-subscription-card-row>

      <app-subscription-card-row icon="label" label="Tags" hoverable (click)="openDialog(anomalyService.getTags(), 'tags')">
        <mat-chip-list *ngIf="subscription.tags.length" class="-chip-wrapper">
          <mat-chip class="mat-chip-nohover" *ngFor="let _ of subscription.tags">
            {{_}}
          </mat-chip>
        </mat-chip-list>
        <span *ngIf="!subscription.tags.length">Tous</span>
      </app-subscription-card-row>
    </app-panel>
  `,
  styleUrls: ['./subscription-card.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter', [
        style({ 'will-change': 'height', opacity: 0, height: '0', margin: 0 }),
        animate(`${animation}`, style({ opacity: 1, height: '*', margin: '*' }))
      ]),
      transition(':leave', [
        style({ 'will-change': 'height', opacity: 1, height: '*', margin: '*' }),
        animate(`${animation}`, style({ opacity: 0, height: 0, margin: 0 }))
      ]),
    ]),
  ],
})
export class SubscriptionCardComponent {

  constructor(
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public anomalyService: AnomalyService,
    public subscriptionService: SubscriptionService,
  ) {
  }

  @HostBinding('@appear') animation = true;

  @Input() subscription!: ApiSubscription;

  get countries(): string[] {
    return this.subscription.countries.map(_ => _.code);
  }

  readonly remove = () => this.subscriptionService.remove(this.subscription.id).subscribe();

  readonly update = (update: Partial<ApiSubscription>) => this.subscriptionService.update(this.subscription.id, update).subscribe();

  readonly openDialog = (options: string[], updatedProperty: 'tags' | 'categories') => {
    const ref = this.dialog.open(SelectDialogComponent).componentInstance;
    ref.options = options;
    ref.initialValues = this.subscription[updatedProperty];
    ref.changed.subscribe(_ => this.update({ [updatedProperty]: _ }));
  };

  readonly openCompaniesDialog = () => {
    const ref = this.dialog.open(CompanySearchDialogComponent).componentInstance;
    ref.companySelected.subscribe((c: CompanySearchResult) => {
      if (!this.subscription.sirets.find(_ => _ === c.siret)) {
        this.update({ sirets: [...this.subscription.sirets, c.siret] });
      }
    });
  };

  readonly openDepartmentsDialog = () => {
    const ref = this.dialog.open(SelectDepartmentsDialogComponent).componentInstance;
    ref.initialValues = this.subscription.departments;
    ref.changed.subscribe(departments => this.update({ departments }));
  };

  readonly updateCountry = (countries: Country[]) => this.update({ countries });

  readonly removeCompany = (siret: string) => this.update({ sirets: this.subscription.sirets.filter(_ => _ !== siret) });

  readonly updateFrequency = (frequency: MatSelectChange) => this.update({ frequency: frequency.value });
}

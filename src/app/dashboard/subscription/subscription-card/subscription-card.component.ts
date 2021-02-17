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
          <mat-select class="-select_input" [(ngModel)]="subscription.frequency" placeholder="Fréquence">
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
        <div *ngIf="subscription.countries.length">
          <div class="-chip" *ngFor="let _ of subscription.countries">
            {{_.name}}
          </div>
        </div>
        <span *ngIf="!subscription.countries.length">Tous</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="location_on" label="Départements" hoverable (click)="openDepartmentsDialog()">
        <div class="-chip" *ngFor="let _ of subscription.departments">
          {{_.code}} - {{_.label}}
        </div>
        <span *ngIf="!subscription.departments.length">Tous</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="dashboard" label="Catégories" hoverable
                                 (click)="openDialog(anomalyService.getCategories(), 'categories')">
        <div *ngIf="subscription.categories.length">
          <div class="-chip" *ngFor="let _ of subscription.categories">
            {{_}}
          </div>
        </div>
        <span *ngIf="!subscription.categories.length">Toutes</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="business" label="SIRET" hoverable>
        <div *ngIf="subscription.sirets.length">
          <div class="-chip" *ngFor="let _ of subscription.sirets">
            {{_}}
          </div>
        </div>
        <span *ngIf="!subscription.sirets.length">Tous</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="label" label="Tags" hoverable (click)="openDialog(anomalyService.getTags(), 'tags')">
        <div *ngIf="subscription.tags.length">
          <div class="-chip" *ngFor="let _ of subscription.tags">
            {{_}}
          </div>
        </div>
        <span *ngIf="!subscription.tags.length">Tous</span></app-subscription-card-row>
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
    return this.subscription.countries.map(_ => _.name);
  }

  readonly updateCountry = (countries: Country[]) => this.update({ countries });

  readonly remove = () => this.subscriptionService.remove(this.subscription.id).subscribe();

  readonly openDialog = (options: string[], updatedProperty: 'tags' | 'categories') => {
    const ref = this.dialog.open(SelectDialogComponent).componentInstance;
    ref.options = options;
    ref.initialValues = this.subscription[updatedProperty];
    ref.changed.subscribe(_ => this.update({ [updatedProperty]: _ }));
  };
  readonly openDepartmentsDialog = () => {
    const ref = this.dialog.open(SelectDepartmentsDialogComponent).componentInstance;
    ref.initialValues = this.subscription.departments;
    ref.changed.subscribe(departments => this.update({ departments }));
  };

  readonly update = (update: Partial<ApiSubscription>) => {
    this.subscriptionService.update(this.subscription.id, update).subscribe();
  };
}

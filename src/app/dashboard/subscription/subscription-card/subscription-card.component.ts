import { Component, HostBinding, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiSubscription } from '../../../api-sdk/model/ApiSubscription';
import { animate, style, transition, trigger } from '@angular/animations';
import { Country } from '../../../api-sdk/model/Country';
import { SelectCategoriesDialogComponent } from './select-categories-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionService } from '../../../services/subscription.service';

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
        <mat-chip-list *ngIf="subscription.countries.length">
          <mat-chip *ngFor="let _ of subscription.countries">
            {{_.name}}
          </mat-chip>
        </mat-chip-list>
        <span *ngIf="!subscription.countries.length">Tous</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="location_on" label="Départements" hoverable>
        <mat-chip-list *ngIf="subscription.departments.length">
          <mat-chip *ngFor="let _ of subscription.departments">
            {{_.code}} - {{_.label}}
          </mat-chip>
        </mat-chip-list>
        <span *ngIf="!subscription.departments.length">Tous</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="dashboard" label="Catégories" hoverable (click)="openCategoriesDialog()">
        <mat-chip-list *ngIf="subscription.categories.length">
          <mat-chip *ngFor="let _ of subscription.categories">
            {{_}}
          </mat-chip>
        </mat-chip-list>
        <span *ngIf="!subscription.categories.length">Toutes</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="business" label="SIRET" hoverable>
        <mat-chip-list *ngIf="subscription.sirets.length">
          <mat-chip *ngFor="let _ of subscription.sirets">
            {{_}}
          </mat-chip>
        </mat-chip-list>
        <span *ngIf="!subscription.sirets.length">Tous</span>
      </app-subscription-card-row>

      <app-subscription-card-row icon="label" label="Tags" hoverable>
        <span>Tous</span>
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

  openCategoriesDialog(): void {
    const ref = this.dialog.open(SelectCategoriesDialogComponent).componentInstance;
    ref.initialValues = this.subscription.categories;
    ref.changed.subscribe(categories => this.update({ categories }));
  }

  readonly update = (update: Partial<ApiSubscription>) => {
    this.subscriptionService.update(this.subscription.id, update).subscribe();
  };
}

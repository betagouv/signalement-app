import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from '../../../api-sdk/model/Subscription';

@Component({
  selector: 'app-subscription-card',
  template: `
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
        (confirmed)="remove.emit()">
        <mat-icon>delete</mat-icon>
      </button>
    </div>

    <app-subscription-card-row icon="location_on" label="Départements" hoverable appCountryDialog>
      <mat-chip-list *ngIf="subscription.departments.length">
        <mat-chip *ngFor="let _ of subscription.departments">
          {{_.code}} - {{_.label}}
        </mat-chip>
      </mat-chip-list>
      <span *ngIf="!subscription.departments.length">Tous</span>
    </app-subscription-card-row>

    <app-subscription-card-row icon="dashboard" label="Catégories" hoverable>
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
  `,
  styleUrls: ['./subscription-card.component.scss']
})
export class SubscriptionCardComponent {

  constructor(public formBuilder: FormBuilder) {
  }

  @Input() subscription: Subscription;

  @Output() remove = new EventEmitter<Subscription>();
}

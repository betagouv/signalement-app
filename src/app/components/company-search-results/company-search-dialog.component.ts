import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompanySearchResult } from '../../model/Company';
import { CompanyService } from '../../services/company.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-company-search-dialog',
  template: `
    <mat-progress-bar *ngIf="loading" mode="indeterminate" class="progress"></mat-progress-bar>
    <h2 mat-dialog-title>Rechercher une entreprise</h2>

    <mat-form-field class="d-block">
      <mat-label>SIREN/SIRET</mat-label>
      <input matInput [formControl]="identityCtrl">
      <button matSuffix mat-icon-button (click)="clear()">
        <mat-icon>clear</mat-icon>
      </button>
      <mat-error *ngIf="identityCtrl.invalid && (identityCtrl.dirty || identityCtrl.touched)">
        Numéro de SIREN ou SIRET invalide (respectivement 9 ou 14 chiffres)
      </mat-error>
      <mat-error *ngIf="!results && loadingError">
        Une erreur technique s'est produite
      </mat-error>
    </mat-form-field>

    <mat-dialog-content *ngIf="results">
      <div *ngIf="!results.length">
        Aucun établissement trouvé
      </div>
      <app-company-search-results
        *ngIf="results.length" [companySearchResults]="results"
        (select)="onSelect($event)">
      </app-company-search-results>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
      <button [disabled]="loading" mat-raised-button color="primary" [disabled]="identityCtrl.invalid"
              (click)="submitCompanySiretForm()">
        Rechercher
      </button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./company-search-dialog.component.scss']
})
export class CompanySearchDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<CompanySearchDialogComponent>,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
  ) {
  }

  selectedCompany: CompanySearchResult;

  results: CompanySearchResult[];

  loadingError = false;

  loading = false;

  identityCtrl: FormControl = this.formBuilder.control('', [Validators.required, Validators.pattern(/^(\d{9}|\d{14})$/)]);

  onSelect = ($event: CompanySearchResult) => {
    this.selectedCompany = $event;
    setTimeout(() => this.dialogRef.close(this.selectedCompany), 300);
  };

  submitCompanySiretForm() {
    this.loading = true;
    this.loadingError = false;
    this.companyService.searchCompaniesByIdentity(this.identityCtrl.value).subscribe(
      companySearchResults => {
        this.results = companySearchResults;
      },
      (err: any) => {
        console.error(err);
        this.loadingError = true;
      },
      () => {
        this.loading = false;
      });
  }

  clear() {
    this.results = undefined;
    this.identityCtrl.setValue('');
  }
}

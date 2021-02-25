import { Component, Directive, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompanySearchResult } from '../../../model/Company';
import { CompanyService } from '../../../services/company.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';

@Directive({
  selector: '[appCompanySearchDialog]',
  host: {
    '(click)': 'openDialog()'
  },
})
export class CompanySearchDialogDirective {

  constructor(public dialog: MatDialog) {
  }

  @Input() appCompanySearchDialog?: string;

  @Output() companySelected = new EventEmitter<CompanySearchResult>();

  openDialog(): void {
    const ref = this.dialog.open(CompanySearchDialogComponent, { width: '500px', });
    ref.componentInstance.companySelected = this.companySelected;
    ref.componentInstance.value = this.appCompanySearchDialog;
  }
}

@Component({
  selector: 'app-company-search-dialog',
  template: `
    <mat-progress-bar *ngIf="loading" mode="indeterminate" class="app-mat-dialog-progress"></mat-progress-bar>
    <h2 mat-dialog-title>Rechercher une entreprise</h2>

    <mat-form-field class="d-block">
      <mat-label>SIREN, SIRET ou RCS</mat-label>
      <input autofocus matInput [formControl]="identityCtrl">
      <button matSuffix mat-icon-button (click)="clear()">
        <mat-icon>clear</mat-icon>
      </button>
    </mat-form-field>

    <mat-error *ngIf="results?.length === 0">
      Aucun établissement trouvé
    </mat-error>
    <mat-error *ngIf="!results && loadingError">
      Une erreur technique s'est produite
    </mat-error>

    <mat-dialog-content *ngIf="results">
      <app-company-search-results
        *ngIf="results.length" [companySearchResults]="results"
        (select)="onSelect($event)">
      </app-company-search-results>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">Fermer</button>
      <button mat-raised-button color="primary" [disabled]="loading || identityCtrl.invalid"
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

  set value(value: string) {
    if (value) {
      this.identityCtrl.setValue(value);
      this.submitCompanySiretForm();
    }
  }

  @Output() companySelected = new EventEmitter<CompanySearchResult>();

  results?: CompanySearchResult[];

  loadingError = false;

  loading = false;

  readonly identityCtrl: FormControl = this.formBuilder.control('', [Validators.required]);

  readonly onSelect = ($event: CompanySearchResult) => {
    setTimeout(() => {
      this.companySelected.emit($event);
      this.dialogRef.close();
    }, 300);
  };

  readonly submitCompanySiretForm = () => {
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
  };

  readonly clear = () => {
    this.results = undefined;
    this.identityCtrl.setValue('');
  };
}

@NgModule({
  declarations: [
    CompanySearchDialogComponent,
    CompanySearchDialogDirective,
  ],
  exports: [
    CompanySearchDialogComponent,
    CompanySearchDialogDirective,
  ],
  imports: [
    ComponentsModule,
    SharedModule,
  ]
})
export class CompanySearchDialogModule {
}

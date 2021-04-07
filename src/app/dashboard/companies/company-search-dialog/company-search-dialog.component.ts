import { Component, Directive, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompanySearchResult } from '../../../model/Company';
import { SearchCompanyByIdentityService } from '../../../services/company.service';
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
    if (this.appCompanySearchDialog) {
      ref.componentInstance.value = this.appCompanySearchDialog;
    }
  }
}

@Component({
  selector: 'app-company-search-dialog',
  template: `
    <mat-progress-bar *ngIf="searchByIdentityService.fetching" mode="indeterminate" class="app-mat-dialog-progress"></mat-progress-bar>
    <h2 mat-dialog-title>Rechercher une entreprise</h2>

    <mat-form-field class="d-block">
      <mat-label>SIREN, SIRET ou RCS</mat-label>
      <input autofocus matInput [formControl]="identityCtrl">
      <button matSuffix mat-icon-button (click)="clear()">
        <mat-icon>clear</mat-icon>
      </button>
    </mat-form-field>

    <mat-dialog-content>
      <ng-container *ngIf="searchByIdentityService.data | async as companies">
        <mat-error *ngIf="companies.length === 0">
          Aucun établissement trouvé
        </mat-error>
        <app-company-search-results
          *ngIf="companies.length" [companySearchResults]="companies"
          (select)="onSelect($event)">
        </app-company-search-results>
      </ng-container>
      <mat-error *ngIf="searchByIdentityService.fetchError">
        Une erreur technique s'est produite
      </mat-error>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">Fermer</button>
      <button mat-raised-button color="primary" [disabled]="searchByIdentityService.fetching || identityCtrl.invalid"
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
    public searchByIdentityService: SearchCompanyByIdentityService,
  ) {
  }

  set value(value: string) {
    if (value) {
      this.identityCtrl.setValue(value);
      this.submitCompanySiretForm();
    }
  }

  @Output() companySelected = new EventEmitter<CompanySearchResult>();

  readonly identityCtrl: FormControl = this.formBuilder.control('', [Validators.required]);

  readonly onSelect = ($event: CompanySearchResult) => {
    setTimeout(() => {
      this.companySelected.emit($event);
      this.dialogRef.close();
    }, 300);
  };

  readonly submitCompanySiretForm = () => {
    this.searchByIdentityService.list({ clean: false }, this.identityCtrl.value).subscribe();
  };

  readonly clear = () => {
    this.searchByIdentityService.clear();
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

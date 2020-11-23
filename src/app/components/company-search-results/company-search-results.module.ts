import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanySearchResultsComponent } from './company-search-results.component';
import { CompanySearchDialogComponent } from './company-search-dialog.component';
import { CompanySearchActionComponent } from './company-search-action.component';
import { MaterialModule } from '../material.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BtnLoadingModule } from '../btn-loading/btn-loading.module';
import { AlertModule } from '../alert/alert.module';


@NgModule({
  declarations: [
    CompanySearchResultsComponent,
    CompanySearchDialogComponent,
    CompanySearchActionComponent,
  ],
  exports: [
    CompanySearchResultsComponent,
    CompanySearchDialogComponent,
    CompanySearchActionComponent,
  ],
  imports: [
    AlertModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    BtnLoadingModule,
    MaterialModule,
  ],
})
export class CompanySearchResultsModule { }

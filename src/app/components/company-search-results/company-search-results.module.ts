import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanySearchResultsComponent } from './company-search-results.component';
import { CompanySearchDialogComponent } from './company-search-dialog.component';
import { CompanySearchActionComponent } from './company-search-action.component';
import { MaterialModule } from '../material.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';


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
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
})
export class CompanySearchResultsModule { }

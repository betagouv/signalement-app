import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanySearchResultsComponent } from './company-search-results.component';
import { CompanySearchDialogComponent, CompanySearchDialogDirective } from './company-search-dialog.component';
import { MaterialModule } from '../material.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    CompanySearchResultsComponent,
    CompanySearchDialogComponent,
    CompanySearchDialogDirective,
  ],
  exports: [
    CompanySearchResultsComponent,
    CompanySearchDialogComponent,
    CompanySearchDialogDirective,
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

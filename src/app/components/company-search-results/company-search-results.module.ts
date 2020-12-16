import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanySearchResultsComponent } from './company-search-results.component';
import { CompanySearchDialogComponent, CompanySearchDialogDirective } from './company-search-dialog.component';


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
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    // MatProgressBarModule,
    // AppMaterialModule,
    // MatDialogModule,
    // MatButtonModule,
    // MatIconModule,
    // MatInputModule,
  ],
})
export class CompanySearchResultsModule { }

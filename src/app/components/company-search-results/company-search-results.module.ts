import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanySearchResultsComponent } from './company-search-results.component';
import { CompanySearchDialogComponent, CompanySearchDialogDirective } from './company-search-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


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
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class CompanySearchResultsModule { }

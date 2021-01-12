import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanySearchResultsComponent } from './company-search-results.component';


@NgModule({
  declarations: [
    CompanySearchResultsComponent,
  ],
  exports: [
    CompanySearchResultsComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
})
export class CompanySearchResultsModule { }

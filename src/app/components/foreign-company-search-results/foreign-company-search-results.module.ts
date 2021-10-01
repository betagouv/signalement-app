import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForeignCompanySearchResultsComponent } from './foreign-company-search-results.component';


@NgModule({
  declarations: [
    ForeignCompanySearchResultsComponent,
  ],
  exports: [
    ForeignCompanySearchResultsComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
})
export class ForeignCompanySearchResultsModule { }

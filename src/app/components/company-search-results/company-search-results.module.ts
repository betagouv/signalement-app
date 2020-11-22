import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanySearchResultsComponent } from './company-search-results.component';



@NgModule({
  declarations: [
    CompanySearchResultsComponent,
  ],
  exports: [
    CompanySearchResultsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class CompanySearchResultsModule { }

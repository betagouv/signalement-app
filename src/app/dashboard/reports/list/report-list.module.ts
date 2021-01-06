import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../../components/components.module';
import { ReportListComponent } from './report-list.component';
import { AppRoleModule } from '../../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../../directives/app-permission/app-permission.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { ReportListDatatableComponent } from './datatable/report-list-datatable.component';
import { SelectDepartmentsModule } from './select-departments/select-departments.module';
import { RouterModule } from '@angular/router';
import { ReportListFiltersComponent } from './filters/report-list-filters.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CountryDialogModule } from '../../../components/country-dialog/country-dialog.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ReportListComponent,
    ReportListFiltersComponent,
    ReportListDatatableComponent,
  ],
  exports: [
    ReportListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ComponentsModule,
    PipesModule,
    AppRoleModule,
    AppPermissionModule,
    SelectDepartmentsModule,
    CountryDialogModule,
    SharedModule,
  ]
})
export class ReportListModule {
}

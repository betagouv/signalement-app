import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../../components/components.module';
import { ReportListComponent } from './report-list.component';
import { BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';
import { AppRoleModule } from '../../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../../directives/app-permission/app-permission.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { ReportListSearchComponent } from './search/report-list-search.component';
import { ReportListDatatableComponent } from './datatable/report-list-datatable.component';
import { SelectDepartmentsModule } from './select-departments/select-departments.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ReportListComponent,
    ReportListSearchComponent,
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
  ]
})
export class ReportListModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../model/AuthUser';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes/pipes.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { CompanySearchResultsModule } from '../../components/company-search-results/company-search-results.module';
import { DashboardCompaniesModule } from '../companies/dashboard-companies.module';
import { ReportedPhonesComponent } from './reported-phones.component';

/* tslint:disable:max-line-length */
const routes: Routes = [
  { path: 'suivi-des-telephones', component: ReportedPhonesComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
];

@NgModule({
  declarations: [
    ReportedPhonesComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    PipesModule,
    AppRoleModule,
    AppPermissionModule,
    SharedModule,
    CompanySearchResultsModule,
    BsDatepickerModule.forRoot(),
    DashboardCompaniesModule
  ]
})
export class ReportedPhonesModule { }

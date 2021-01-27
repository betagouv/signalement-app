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
import { ManageReportedPhonesComponent } from './manage-reported-phones/manage-reported-phones.component';
import { UnregisteredReportedPhonesComponent } from './unregistered-reported-phones/unregistered-reported-phones.component';
import { ReportedPhonesTabsComponent } from './reported-phones-tabs/reported-phones-tabs.component';

/* tslint:disable:max-line-length */
const routes: Routes = [
  { path: 'moderation-telephones', component: ManageReportedPhonesComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
  { path: 'telephones/non-identifies', component: UnregisteredReportedPhonesComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
];

@NgModule({
  declarations: [
    UnregisteredReportedPhonesComponent,
    ManageReportedPhonesComponent,
    ReportedPhonesTabsComponent
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

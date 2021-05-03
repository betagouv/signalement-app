import { NgModule } from '@angular/core';
import { UnregisteredWebsitesComponent } from './unregistered-websites/unregistered-websites.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../model/AuthUser';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { ManageWebsitesComponent } from './manage-websites/manage-websites.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes/pipes.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { CompanySearchResultsModule } from '../../components/company-search-results/company-search-results.module';
import { WebsitesTabsComponent } from './websites-tabs/websites-tabs.component';
import { DashboardCompaniesModule } from '../companies/dashboard-companies.module';
import { CompanySearchDialogModule } from '../companies/company-search-dialog/company-search-dialog.component';

/* tslint:disable:max-line-length */
const routes: Routes = [
  { path: 'moderation-url-entreprises', component: ManageWebsitesComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
  { path: 'sites-internet/non-identifies', component: UnregisteredWebsitesComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
];

@NgModule({
  declarations: [
    UnregisteredWebsitesComponent,
    ManageWebsitesComponent,
    WebsitesTabsComponent
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
    DashboardCompaniesModule,
    CompanySearchDialogModule
  ]
})
export class WebsitesModule { }

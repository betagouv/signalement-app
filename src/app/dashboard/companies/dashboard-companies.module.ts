import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { MyCompaniesComponent } from './my-companies/my-companies.component';
import { CompaniesAdminComponent } from './companies-admin/companies-admin.component';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { CompanyCardComponent } from './company-card/company-card.component';
import { Roles } from '../../model/AuthUser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CompanyInvitationComponent } from './company-invitation/company-invitation.component';
import { CompanyAccessesComponent } from './company-accesses/company-accesses.component';
import { SharedModule } from '../shared/shared.module';
import { CompanySearchDialogComponent, CompanySearchDialogDirective } from './company-search-dialog/company-search-dialog.component';

const routes: Routes = [
  { path: 'entreprise/acces/:siret', component: CompanyAccessesComponent, canActivate: [AuthGuard] },
  { path: 'entreprise/acces/:siret/invitation', component: CompanyInvitationComponent, canActivate: [AuthGuard] },
  { path: 'mes-entreprises', component: MyCompaniesComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Pro] } },
  { path: 'entreprises', component: CompaniesAdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
  { path: 'entreprises/les-plus-signalees', component: CompaniesAdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
  { path: 'entreprises/recherche', component: CompaniesAdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
  { path: 'entreprises/a-activer', component: CompaniesAdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
];

@NgModule({
  declarations: [
    CompanyAccessesComponent,
    CompanyInvitationComponent,
    MyCompaniesComponent,
    CompaniesAdminComponent,
    CompanyCardComponent,
    CompanySearchDialogComponent,
    CompanySearchDialogDirective,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    BsDropdownModule.forRoot(),
    ComponentsModule,
    BsDatepickerModule.forRoot(),
    AppRoleModule,
    AppPermissionModule,
    PaginationModule.forRoot(),
    SharedModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ],
})
export class DashboardCompaniesModule {
}

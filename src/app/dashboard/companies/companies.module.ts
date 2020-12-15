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

const routes: Routes = [
  { path: 'mes-entreprises', component: MyCompaniesComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Pro] } },
  { path: 'entreprises', component: CompaniesAdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
  { path: 'entreprises/les-plus-signalees', component: CompaniesAdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
  { path: 'entreprises/recherche', component: CompaniesAdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
  { path: 'entreprises/a-activer', component: CompaniesAdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
];

@NgModule({
  declarations: [
    MyCompaniesComponent,
    CompanyCardComponent,
    CompaniesAdminComponent,
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
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ],
})
export class CompaniesModule { }

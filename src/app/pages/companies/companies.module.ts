import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { CompanyAccessesComponent } from './company-accesses/company-accesses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';
import { CompanyActivationComponent } from './company-activation/company-activation.component';
import { MyCompaniesComponent } from './my-companies/my-companies.component';
import { CompanyInvitationComponent } from './company-invitation/company-invitation.component';
import { NgxLoadingModule } from 'ngx-loading';
import { CompaniesAdminComponent } from './companies-admin/companies-admin.component';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { PaginationModule } from 'ngx-bootstrap';
import { CompanyCardComponent } from './company-card/company-card.component';

const routes: Routes = [
  { path: 'entreprise/acces/:siret', component: CompanyAccessesComponent, canActivate: [AuthGuard] },
  { path: 'entreprise/acces/:siret/invitation', component: CompanyInvitationComponent, canActivate: [AuthGuard] },
  { path: 'entreprise/activation', component: CompanyActivationComponent },
  { path: 'activation', component: CompanyActivationComponent }, // TODO temporary fix, it can be removed after the 05/04/2020
  { path: 'mes-entreprises', component: MyCompaniesComponent, canActivate: [AuthGuard] },
  { path: 'entreprises', component: CompaniesAdminComponent, canActivate: [AuthGuard] },
  { path: 'entreprises/les-plus-signalees', component: CompaniesAdminComponent, canActivate: [AuthGuard] },
  { path: 'entreprises/recherche', component: CompaniesAdminComponent, canActivate: [AuthGuard] },
  { path: 'entreprises/a-activer', component: CompaniesAdminComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    CompanyActivationComponent,
    CompanyAccessesComponent,
    CompanyInvitationComponent,
    MyCompaniesComponent,
    CompaniesAdminComponent,
    CompanyCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NgxLoadingModule.forRoot(NgxLoadingConfig),
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

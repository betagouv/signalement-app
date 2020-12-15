import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { CompanyAccessesComponent } from './company-accesses/company-accesses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { CompanyActivationComponent } from './company-activation/company-activation.component';
import { CompanyInvitationComponent } from './company-invitation/company-invitation.component';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';

const routes: Routes = [
  { path: 'entreprise/acces/:siret', component: CompanyAccessesComponent, canActivate: [AuthGuard] },
  { path: 'entreprise/acces/:siret/invitation', component: CompanyInvitationComponent, canActivate: [AuthGuard] },
  { path: 'entreprise/activation', component: CompanyActivationComponent },
  { path: 'activation', component: CompanyActivationComponent },
];

@NgModule({
  declarations: [
    CompanyActivationComponent,
    CompanyAccessesComponent,
    CompanyInvitationComponent,
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

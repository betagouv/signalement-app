import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { CompanyActivationComponent } from './company-activation/company-activation.component';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';

const routes: Routes = [
  { path: 'entreprise/activation', component: CompanyActivationComponent },
  { path: 'activation', component: CompanyActivationComponent },
];

@NgModule({
  declarations: [
    CompanyActivationComponent,
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

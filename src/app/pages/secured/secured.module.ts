import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { DGCCRFComponent } from './dgccrf/dgccrf.component';
import { AsyncFilesComponent } from './downloads/asyncfiles.component';
import { AdminComponent } from './admin/admin.component';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { Roles } from '../../model/AuthUser';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const routes: Routes = [
  { path: 'admin/invitation-ccrf', component: AdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
  { path: 'mes-telechargements', component: AsyncFilesComponent, canActivate: [AuthGuard] },
  { path: 'mode-emploi-dgccrf', component: DGCCRFComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.DGCCRF] } },
];

@NgModule({
  declarations: [
    DGCCRFComponent,
    AsyncFilesComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    BsDatepickerModule.forRoot(),
    ComponentsModule,
    PipesModule,
    AppRoleModule,
    AppPermissionModule,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    AuthGuard
  ]
})
export class SecuredModule { }

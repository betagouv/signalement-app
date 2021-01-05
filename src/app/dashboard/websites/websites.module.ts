import { NgModule } from '@angular/core';
import { WebsitesUnregisteredComponent } from './unregistered/websites-unregistered.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../model/AuthUser';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppRoleModule } from '../../directives/app-role/app-role.module';

/* tslint:disable:max-line-length */
const routes: Routes = [
  {
    path: 'sites-internet/non-identifies', component: WebsitesUnregisteredComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] }
  },
];

@NgModule({
  declarations: [WebsitesUnregisteredComponent],
  imports: [
    RouterModule.forChild(routes),
    ComponentsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    AppRoleModule,
  ]
})
export class WebsitesModule { }

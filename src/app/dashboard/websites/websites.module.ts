import { NgModule } from '@angular/core';
import { WebsitesUnregisteredComponent } from './unregistered/websites-unregistered.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../model/AuthUser';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../shared/shared.module';

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
  ]
})
export class WebsitesModule { }

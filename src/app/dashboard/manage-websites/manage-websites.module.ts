import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { PipesModule } from '../../pipes/pipes.module';
import { Roles } from '../../model/AuthUser';
import { ManageWebsitesComponent } from './manage-websites.component';
import { CompanySearchResultsModule } from '../../components/company-search-results/company-search-results.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'moderation-url-entreprises',
    component: ManageWebsitesComponent,
    canActivate: [AuthGuard],
    data: { expectedRoles: [Roles.Admin] }
  },
];

@NgModule({
  declarations: [
    ManageWebsitesComponent,
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
  ]
})
export class ManageWebsitesModule {
}

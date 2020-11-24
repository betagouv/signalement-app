import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    ComponentsModule,
    PipesModule,
    AppRoleModule,
    AppPermissionModule,
    CompanySearchResultsModule,
    MatProgressBarModule,
  ]
})
export class ManageWebsitesModule {
}

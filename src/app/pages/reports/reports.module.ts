import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';
import { ConsumerReviewComponent } from './consumer-review/consumer-review.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportListProComponent } from './list-pro/report-list-pro.component';
import { ReportListComponent } from './list/report-list.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ReportDetailComponent } from './detail/report-detail.component';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PipesModule } from '../../pipes/pipes.module';
import { Roles } from '../../model/AuthUser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReportListSearchComponent } from './list/search/report-list-search.component';

const routes: Routes = [
  { path: 'suivi-des-signalements/:reportId/avis', component: ConsumerReviewComponent },
  { path: 'suivi-des-signalements', component: ReportListProComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Pro] } },
  { path: 'suivi-des-signalements/pro', component: ReportListProComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Pro] } },
  { path: 'suivi-des-signalements/admin', component: ReportListComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
  { path: 'suivi-des-signalements/dgccrf', component: ReportListComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.DGCCRF] } },
  { path: 'suivi-des-signalements/pro/siret/:siret', component: ReportListProComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Pro] } },
  { path: 'suivi-des-signalements/admin/siret/:siret', component: ReportListComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
  { path: 'suivi-des-signalements/dgccrf/siret/:siret', component: ReportListComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.DGCCRF] } },
  { path: 'suivi-des-signalements/report/:reportId', component: ReportDetailComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    ConsumerReviewComponent,
    ReportListProComponent,
    ReportListComponent,
    ReportDetailComponent,
    ReportListSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    BsDatepickerModule.forRoot(),
    ComponentsModule,
    PipesModule,
    AppRoleModule,
    AppPermissionModule,
    SelectDepartmentsModule,
  ]
})
export class ReportsModule { }

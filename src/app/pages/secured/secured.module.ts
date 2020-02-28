import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule, BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { ReportDetailComponent } from './reports/detail/report-detail.component';
import { ReportListComponent } from './reports/list/report-list.component';
import { MostReportedListComponent } from './reports/ordered/most-reported-list.component';
import { DGCCRFComponent } from './dgccrf/dgccrf.component';
import { AsyncFilesComponent } from './downloads/asyncfiles.component';
import { AdminComponent } from './admin/admin.component';
import { NgxLoadingModule } from 'ngx-loading';
import { EventComponent } from './reports/event/event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppPermissionDirective } from '../../directives/app-permission.directive';
import { AppRoleDirective } from '../../directives/app-role.directive';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  { path: 'admin/invitation-ccrf', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'suivi-des-signalements', component: ReportListComponent, canActivate: [AuthGuard] },
  { path: 'suivi-des-signalements/siret/:siret', component: ReportListComponent, canActivate: [AuthGuard] },
  { path: 'pro-les-plus-signales', component: MostReportedListComponent, canActivate: [AuthGuard] },
  { path: 'suivi-des-signalements/report/:reportId', component: ReportDetailComponent, canActivate: [AuthGuard] },
  { path: 'abonnements', component: SubscriptionComponent, canActivate: [AuthGuard] },
  { path: 'mes-telechargements', component: AsyncFilesComponent, canActivate: [AuthGuard] },
  { path: 'mode-emploi-dgccrf', component: DGCCRFComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ReportListComponent,
    ReportDetailComponent,
    EventComponent,
    AppPermissionDirective,
    AppRoleDirective,
    DGCCRFComponent,
    SubscriptionComponent,
    MostReportedListComponent,
    AsyncFilesComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    BsDatepickerModule.forRoot(),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    RouterModule,
    AppRoleDirective,
    AppPermissionDirective,
  ],
  providers: [
    AuthGuard
  ],
  entryComponents: [
    EventComponent
  ]
})
export class SecuredModule { }

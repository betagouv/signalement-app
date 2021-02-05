import { NgModule } from '@angular/core';
import { SubscriptionModule } from './subscription/subscription.module';
import { ReportsModule } from './reports/reports.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../model/AuthUser';
import { AdminComponent } from './admin/admin.component';
import { DashboardCompaniesModule } from './companies/dashboard-companies.module';
import { DGCCRFComponent } from './dgccrf/dgccrf.component';
import { AsyncFilesComponent } from './downloads/asyncfiles.component';
import { ComponentsModule } from '../components/components.module';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WebsitesModule } from './websites/websites.module';
import { ReportedPhonesModule } from './reported-phones/reported-phones.module';

const routes: Routes = [
  { path: 'mode-emploi-dgccrf', component: DGCCRFComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.DGCCRF] } },
  { path: 'mes-telechargements', component: AsyncFilesComponent, canActivate: [AuthGuard] },
  { path: 'admin/invitation-ccrf', component: AdminComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin] } },
  { path: 'compte/mot-de-passe', component: PasswordChangeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    DGCCRFComponent,
    AdminComponent,
    AsyncFilesComponent,
    PasswordChangeComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    ComponentsModule,
    DashboardCompaniesModule,
    SubscriptionModule,
    ReportsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    WebsitesModule,
    ReportedPhonesModule
  ],
  exports: [],
  providers: [],
})
export class DashboardModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule, BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { ReportDetailComponent } from './reports/detail/report-detail.component';
import { ReportListComponent } from './reports/list/report-list.component';
import { NgxLoadingModule } from 'ngx-loading';
import { EventComponent } from './reports/event/event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppPermissionDirective } from '../../directives/app-permission.directive';
import { AppRoleDirective } from '../../directives/app-role.directive';
import { PasswordComponent } from '../../pages/password/password.component';

const routes: Routes = [
  { path: 'suivi-des-signalements', component: ReportListComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: PasswordComponent }
];

@NgModule({
  declarations: [
    ReportListComponent,
    ReportDetailComponent,
    EventComponent,
    AppPermissionDirective,
    AppRoleDirective,
    PasswordComponent,
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
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    AuthGuard
  ],
  entryComponents: [
    EventComponent
  ]
})
export class AdminModule { }

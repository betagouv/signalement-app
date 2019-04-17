import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { ReportDetailComponent } from './reports/detail/report-detail.component';
import { ReportListComponent } from './reports/list/report-list.component';
import { NgxLoadingModule } from 'ngx-loading';

const routes: Routes = [
  { path: 'suivi-des-signalements', component: ReportListComponent, canActivate: [AuthGuard] },
  { path: 'suivi-des-signalements/:reportId', component: ReportDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ReportListComponent,
    ReportDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    AuthGuard
  ]
})
export class AdminModule { }

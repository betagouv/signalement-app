import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: 'suivi-des-signalements', component: ReportsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    AuthGuard
  ]
})
export class AdminModule { }

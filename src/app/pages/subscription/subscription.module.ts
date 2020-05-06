import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';
import { SubscriptionDetailComponent } from './subscription-detail/subscription-detail.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';


const routes: Routes = [
  { path: 'abonnements', component: SubscriptionListComponent, canActivate: [AuthGuard] },
  { path: 'abonnements/nouveau', component: SubscriptionDetailComponent, canActivate: [AuthGuard] },
  { path: 'abonnements/:subscriptionId', component: SubscriptionDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    SubscriptionDetailComponent,
    SubscriptionListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    ComponentsModule,
  ]
})
export class SubscriptionModule { }
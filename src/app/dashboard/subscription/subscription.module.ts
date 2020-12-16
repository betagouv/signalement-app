import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { SubscriptionDetailComponent } from './subscription-detail/subscription-detail.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { Roles } from '../../model/AuthUser';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  { path: 'abonnements', component: SubscriptionListComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
  { path: 'abonnements/nouveau', component: SubscriptionDetailComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
  { path: 'abonnements/:subscriptionId', component: SubscriptionDetailComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
];

@NgModule({
  declarations: [
    SubscriptionDetailComponent,
    SubscriptionListComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    ComponentsModule,
  ]
})
export class SubscriptionModule { }

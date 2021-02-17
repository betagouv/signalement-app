import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { SubscriptionDetailComponent, SubscriptionDialogDirective } from './subscription-detail/subscription-detail.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { Roles } from '../../model/AuthUser';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionCardComponent } from './subscription-card/subscription-card.component';
import { SelectDepartmentsModule } from '../reports/list/select-departments/select-departments.module';
import { PanelModule } from '../shared/panel/panel.module';
import { SubscriptionListItemComponent } from './list/subscription-list-item.component';
import { CountryDialogModule } from '../reports/list/country-dialog/country-dialog.module';
import { MaterialModule } from '../shared/material.module';
import { SubscriptionCardRowComponent } from './subscription-card/subscription-card-row.component';
import { SelectCategoriesDialogComponent } from './subscription-card/select-categories-dialog.component';

const routes: Routes = [
  { path: 'abonnements', component: SubscriptionListComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
  { path: 'abonnements/nouveau', component: SubscriptionDetailComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
  { path: 'abonnements/:subscriptionId', component: SubscriptionDetailComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },

];

@NgModule({
  declarations: [
    SelectCategoriesDialogComponent,
    SubscriptionDialogDirective,
    SubscriptionDetailComponent,
    SubscriptionListComponent,
    SubscriptionListItemComponent,
    SubscriptionCardComponent,
    SubscriptionCardRowComponent,
  ],
  imports: [
    CountryDialogModule,
    PanelModule,
    SelectDepartmentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    ComponentsModule,
    MaterialModule,
  ]
})
export class SubscriptionModule { }

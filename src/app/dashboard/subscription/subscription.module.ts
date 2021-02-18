import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ComponentsModule } from '../../components/components.module';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { Roles } from '../../model/AuthUser';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionCardComponent } from './subscription-card/subscription-card.component';
import { SelectDepartmentsModule } from '../reports/list/select-departments/select-departments.module';
import { CountryDialogModule } from '../reports/list/country-dialog/country-dialog.module';
import { SubscriptionCardRowComponent } from './subscription-card/subscription-card-row.component';
import { SelectDialogComponent } from './subscription-card/select-dialog.component';
import { SelectDepartmentsDialogComponent } from './subscription-card/select-departments.component';
import { CompanySearchDialogModule } from '../companies/company-search-dialog/company-search-dialog.component';

const routes: Routes = [
  { path: 'abonnements', component: SubscriptionListComponent, canActivate: [AuthGuard], data: { expectedRoles: [Roles.Admin, Roles.DGCCRF] } },
];

@NgModule({
  declarations: [
    SelectDialogComponent,
    SelectDepartmentsDialogComponent,
    SubscriptionListComponent,
    SubscriptionCardComponent,
    SubscriptionCardRowComponent,
  ],
  imports: [
    CompanySearchDialogModule,
    CountryDialogModule,
    SelectDepartmentsModule,
    RouterModule.forChild(routes),
    SharedModule,
    ComponentsModule,
  ]
})
export class SubscriptionModule { }

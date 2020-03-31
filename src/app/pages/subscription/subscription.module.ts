import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { SubscriptionComponent } from './subscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';


const routes: Routes = [
  { path: 'abonnements', component: SubscriptionComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    SubscriptionComponent
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

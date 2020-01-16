import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { defineLocale, frLocale } from 'ngx-bootstrap';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forget-password/forgot-password.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccessTokenComponent } from './accesstoken.component';
import { AccountRegistrationComponent } from './account-registration/account-registration.component';

defineLocale('fr', frLocale);

const routes: Routes = [
  { path: 'login', redirectTo: 'dgccrf' },
  { path: 'connexion', component: LoginComponent },
  { path: 'dgccrf', component: LoginComponent },
  { path: 'connexion/perte-mot-de-passe', component: ForgotPasswordComponent },
  { path: 'connexion/perte-mot-de-passe/dgccrf', component: ForgotPasswordComponent },
  { path: 'connexion/nouveau-mot-de-passe/:token', component: ResetPasswordComponent },
  { path: 'compte/inscription', component: AccountRegistrationComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AccessTokenComponent,
    AccountRegistrationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
  ],
  exports: [
    RouterModule,
  ]
})
export class AccountModule { }
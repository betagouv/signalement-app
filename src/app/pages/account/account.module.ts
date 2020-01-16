import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { defineLocale, frLocale } from 'ngx-bootstrap';
import { LoginComponent } from './login/login.component';
import { PasswordForgotComponent } from './password-forgot/password-forgot.component';
import { NgxLoadingModule } from 'ngx-loading';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AccessTokenComponent } from './accesstoken.component';
import { AccountRegistrationComponent } from './account-registration/account-registration.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { AuthGuard } from '../../guards/auth.guard';

defineLocale('fr', frLocale);

const routes: Routes = [
  { path: 'login', redirectTo: 'dgccrf' },
  { path: 'connexion', component: LoginComponent },
  { path: 'dgccrf', component: LoginComponent },
  { path: 'connexion/perte-mot-de-passe', component: PasswordForgotComponent },
  { path: 'connexion/perte-mot-de-passe/dgccrf', component: PasswordForgotComponent },
  { path: 'connexion/nouveau-mot-de-passe/:token', component: PasswordResetComponent },
  { path: 'compte/inscription', component: AccountRegistrationComponent },
  { path: 'compte/mot-de-passe', component: PasswordChangeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    LoginComponent,
    PasswordForgotComponent,
    PasswordResetComponent,
    AccessTokenComponent,
    AccountRegistrationComponent,
    PasswordChangeComponent,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { defineLocale, frLocale } from 'ngx-bootstrap';
import { LoginComponent } from './login/login.component';
import { PasswordForgotComponent } from './password-forgot/password-forgot.component';
import { NgxLoadingModule } from 'ngx-loading';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AccountRegistrationComponent } from './account-registration/account-registration.component';
import { EmailValidationComponent } from './email-validation/email-validation.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { AuthGuard } from '../../guards/auth.guard';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';

defineLocale('fr', frLocale);

const routes: Routes = [
  { path: 'login', redirectTo: 'dgccrf' },
  { path: 'connexion', component: LoginComponent },
  { path: 'dgccrf', component: LoginComponent },
  { path: 'connexion/validation-email', component: EmailValidationComponent },
  { path: 'connexion/perte-mot-de-passe', component: PasswordForgotComponent },
  { path: 'connexion/perte-mot-de-passe/dgccrf', component: PasswordForgotComponent },
  { path: 'connexion/nouveau-mot-de-passe/:token', component: PasswordResetComponent },
  { path: 'compte/inscription', component: AccountRegistrationComponent },
  { path: 'compte/mot-de-passe', component: PasswordChangeComponent, canActivate: [AuthGuard] },
  { path: 'entreprise/rejoindre/:siret', component: AccountRegistrationComponent },
  { path: 'dgccrf/rejoindre', component: AccountRegistrationComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    PasswordForgotComponent,
    PasswordResetComponent,
    AccountRegistrationComponent,
    PasswordChangeComponent,
    EmailValidationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    ComponentsModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class AccountModule { }

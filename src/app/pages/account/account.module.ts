import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { PasswordForgotComponent } from './password-forgot/password-forgot.component';
import { NgxLoadingModule } from 'ngx-loading';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AccountRegistrationComponent } from './account-registration/account-registration.component';
import { EmailValidationComponent } from './email-validation/email-validation.component';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';
import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';
import { PanelModule } from '../../dashboard/shared/panel/panel.module';
import { PageModule } from '../../dashboard/shared/page/page.module';
import { FenderModule } from '../../dashboard/shared/fender/fender';
import { AlertModule } from '../../dashboard/shared/alert/alert';

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
  { path: 'entreprise/rejoindre/:siret', component: AccountRegistrationComponent },
  { path: 'dgccrf/rejoindre', component: AccountRegistrationComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    PasswordForgotComponent,
    PasswordResetComponent,
    AccountRegistrationComponent,
    EmailValidationComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    ComponentsModule,
    PanelModule,
    PageModule,
    FenderModule,
    AlertModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class AccountModule { }

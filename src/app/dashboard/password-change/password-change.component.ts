import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { AccountEventActions, AnalyticsService, EventCategories } from '../../services/analytics.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

  readonly matchingPasswords = (passwordKey: string, confirmPasswordKey: string) => {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return { notEquivalent: true };
      }
    };
  };

  readonly oldPasswordCtrl = this.formBuilder.control('', Validators.required);
  readonly passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
  readonly confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
  readonly changePasswordForm = this.formBuilder.group({
    oldPasswordCtrl: this.oldPasswordCtrl,
    passwordCtrl: this.passwordCtrl,
    confirmPasswordCtrl: this.confirmPasswordCtrl,
  }, { validator: this.matchingPasswords('passwordCtrl', 'confirmPasswordCtrl') });

  showErrors = false;
  showSuccess = false;
  authenticationError?: string;

  constructor(public formBuilder: FormBuilder,
    private titleService: Title,
    private meta: Meta,
    private accountService: AccountService,
    private analyticsService: AnalyticsService,
    private router: Router) {
  }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.account.changePassword.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.account.changePassword.description });
  }

  submitForm() {
    this.authenticationError = '';
    this.showSuccess = false;
    this.showErrors = false;

    if (!this.changePasswordForm.valid) {
      this.showErrors = true;
    } else {
      this.accountService.changePassword(this.oldPasswordCtrl.value, this.passwordCtrl.value)
      .subscribe(
        () => {
          this.analyticsService.trackEvent(EventCategories.account, AccountEventActions.changePasswordSuccess);
          this.showSuccess = true;
          // TODO : erreur si l'on reset le formulaire. Si erreur auparavant, elles sont à nouveau visible
          this.changePasswordForm.reset();
        },
        error => {
          this.analyticsService.trackEvent(EventCategories.account, AccountEventActions.changePasswordFail);
          this.showErrors = true;
          if (error.status === 401) {
            this.authenticationError = `Problème d'authentification`;
          } else if (error.status === 400) {
            this.authenticationError = `Les données ne sont pas cohérentes`;
          } else {
            this.authenticationError = `Echec de la mise à jour du mot de passe`;
          }
        }
      );
    }
  }

  resetMessages() {
    this.showSuccess = false;
    this.showErrors = false;
    this.authenticationError = '';
  }
}

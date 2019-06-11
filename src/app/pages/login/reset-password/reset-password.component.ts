import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AnalyticsService, AuthenticationEventActions, EventCategories } from '../../../services/analytics.service';
import { ActivatedRoute } from '@angular/router';
import pages from '../../../../assets/data/pages.json';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  authToken: string;
  newPasswordForm: FormGroup;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;
  loadingError: string;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.account.changePassword.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.account.changePassword.description });
    this.initForm();

    this.route.paramMap.subscribe(params => {
        this.authToken = params.get('token');
      }
    );
  }

  initForm() {
    function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
      return (group: FormGroup) => {
        const password = group.controls[passwordKey];
        const confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
          return { notEquivalent: true };
        }
      };
    }

    this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
    this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);

    this.newPasswordForm = this.formBuilder.group({
      passwordCtrl: this.passwordCtrl,
      confirmPasswordCtrl: this.confirmPasswordCtrl,
    }, { validator: matchingPasswords('passwordCtrl', 'confirmPasswordCtrl')});
  }

  submitForm() {

    this.loadingError = false;
    this.showSuccess = false;
    this.showErrors = false;
    if (!this.newPasswordForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.authenticationService.resetPassword(this.passwordCtrl.value, this.authToken)
        .subscribe(
          () => {
            this.loading = false;
            this.analyticsService.trackEvent(EventCategories.account, AuthenticationEventActions.resetPasswordSuccess);
            this.showSuccess = true;
            this.newPasswordForm.reset();
          },
          error => {
            this.loading = false;
            this.analyticsService.trackEvent(EventCategories.account, AuthenticationEventActions.resetPasswordFail);
            this.showErrors = true;
            if (error.status === 404) {
              this.loadingError = `Le lien permettant de demander un nouveau mot de passe n'est pas valide, veuillez refaire une demande.`;
            } else {
              this.loadingError = `Une erreur technique s'est produite.`;
            }
          }
        );
    }
  }

  resetMessages() {
    this.showSuccess = false;
    this.showErrors = false;
  }

}

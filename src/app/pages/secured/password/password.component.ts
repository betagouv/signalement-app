import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { AuthenticationService } from '../../../services/authentication.service';
import { AnalyticsService, EventCategories, ChangePasswordEventActions } from '../../../services/analytics.service';
import { Router } from '@angular/router';
import { User } from '../../../model/AuthUser';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  user: User;

  changePasswordForm: FormGroup;
  oldPasswordCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;

  showErrors: boolean;
  showSuccess: boolean;
  authenticationError: string;

  constructor(public formBuilder: FormBuilder,
    private titleService: Title,
    private meta: Meta,
    private authenticationService: AuthenticationService,
    private analyticsService: AnalyticsService,
    private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle(pages.changePassword.title);
    this.meta.updateTag({ name: 'description', content: pages.login.description });
    this.initForm();

    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });

  }

  initForm() {

    function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
      return (group: FormGroup) => {
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
          return { notEquivalent: true };
        }
      }
    }

    this.oldPasswordCtrl = this.formBuilder.control('', Validators.required);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
    this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);

    this.changePasswordForm = this.formBuilder.group({
      oldPasswordCtrl: this.oldPasswordCtrl,
      passwordCtrl: this.passwordCtrl,
      confirmPasswordCtrl: this.confirmPasswordCtrl,
    }, { validator: matchingPasswords('passwordCtrl', 'confirmPasswordCtrl')});
  }

  submitForm() {
    this.authenticationError = '';
    this.showSuccess = false;
    this.showErrors = false;

    if (!this.changePasswordForm.valid) {
      this.showErrors = true;
    } else {
      this.authenticationService.changePassword(this.oldPasswordCtrl.value, this.passwordCtrl.value)
      .subscribe(
        () => {
          this.analyticsService.trackEvent(EventCategories.changePassword, ChangePasswordEventActions.success);
          this.showSuccess = true;
          // TODO : erreur si l'on reset le formulaire. Si erreur auparavant, elles sont à nouveau visible
          this.changePasswordForm.reset();
        },
        error => {
          this.analyticsService.trackEvent(EventCategories.changePassword, ChangePasswordEventActions.fail);
          this.showErrors = true;
          if (error.status == "401") {
            this.authenticationError = `Problème d'authentification`;
          } else if (error.status = "400") {
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

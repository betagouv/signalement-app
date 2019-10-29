import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../../services/authentication.service';
import { AccountEventActions, AnalyticsService, EventCategories } from '../../../../services/analytics.service';
import { Router } from '@angular/router';
import pages from '../../../../../assets/data/pages.json';
import { User, TokenInfo } from '../../../../model/AuthUser';
import { AccountService } from '../../../../services/account.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss']
})
export class AccountActivationComponent implements OnInit {

  tokenInfo: TokenInfo;

  activationForm: FormGroup;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmPasswordCtrl: FormControl;
  gcuAgreementCtrl: FormControl;

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private accountService: AccountService,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.account.activation.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.account.activation.description });
    this.initForm();

    this.authenticationService.tokenInfo.subscribe(tokenInfo => {
      this.tokenInfo = tokenInfo;
    });
  }

  initForm() {
    function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
      return (group: FormGroup) => {
        const password = group.controls[passwordKey];
        const confirmPassword = group.controls[confirmPasswordKey];
        if (password.value !== confirmPassword.value) {
          return { notEquivalent: true };
        } else {
          return null;
        }
      };
    }

    this.firstNameCtrl = this.formBuilder.control('', Validators.required);
    this.lastNameCtrl = this.formBuilder.control('', Validators.required);
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
    this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
    this.gcuAgreementCtrl = this.formBuilder.control('', Validators.requiredTrue);

    this.activationForm = this.formBuilder.group({
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl,
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl,
      gcuAgreement: this.gcuAgreementCtrl,
    }, { validator: matchingPasswords('password', 'confirmPassword')});
  }

  submitForm() {
    this.showErrors = false;
    this.showSuccess = false;
    this.loadingError = false;
    if (!this.activationForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.accountService.activateAccount(
        this.tokenInfo,
        <User>{
          firstName: this.firstNameCtrl.value,
          lastName: this.lastNameCtrl.value,
          email: this.emailCtrl.value,
          password: this.passwordCtrl.value
        }
      ).subscribe(
        () => {
          this.loading = false;
          this.analyticsService.trackEvent(EventCategories.account, AccountEventActions.activateAccountSuccess);
          this.showSuccess = true;
        },
        error => {
          this.loading = false;
          this.loadingError = true;
          this.analyticsService.trackEvent(EventCategories.account, AccountEventActions.activateAccountFail);
          this.showErrors = true;
        }
      );
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  AccountEventActions,
  AccountEventNames,
  ActionResultNames,
  AnalyticsService,
  EventCategories,
} from '../../../services/analytics.service';
import { ActivatedRoute, Router } from '@angular/router';
import pages from '../../../../assets/data/pages.json';
import { TokenInfo, User } from '../../../model/AuthUser';
import { AccountService } from '../../../services/account.service';
import HttpStatusCodes from 'http-status-codes';
import { combineLatest, iif } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-account-registration',
  templateUrl: './account-registration.component.html',
  styleUrls: ['./account-registration.component.scss']
})
export class AccountRegistrationComponent implements OnInit {

  tokenInfo: TokenInfo;
  isAuthenticated: boolean;

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
  loadingError = false;
  conflictError = false;
  tokenError = false;

  mayEditEmail = false;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private accountService: AccountService,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.account.activation.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.account.activation.description });

    if (isPlatformBrowser(this.platformId)) {

      const siret = this.activatedRoute.snapshot.paramMap.get('siret');
      const token = this.activatedRoute.snapshot.queryParamMap.get('token');

      this.loading = true;
      combineLatest([
        this.authenticationService.isAuthenticated(),
        iif(
          () => token !== null,
          (siret === null) ? this.authenticationService.fetchTokenInfo(token)
                           : this.authenticationService.fetchCompanyTokenInfo(siret, token),
          this.authenticationService.getStoredTokenInfo()
        )
      ]).subscribe(([isAuthenticated, tokenInfo]: [boolean, TokenInfo]) => {
          this.loading = false;
          if (tokenInfo == null) {
            return this.router.navigate(['/connexion']);
          } else if (isAuthenticated) {
            this.isAuthenticated = true;
          } else {
            this.initForm();
            this.tokenInfo = <TokenInfo>tokenInfo;
            this.mayEditEmail = (this.tokenInfo.emailedTo === undefined);
            if (!this.mayEditEmail) {
              this.activationForm.controls.email.clearValidators();
              this.activationForm.controls.email.updateValueAndValidity();
            }
          }
        },
        (err) => {
          this.loading = false;
          this.tokenError = true;
        }
      );
    }
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
    this.conflictError = false;
    if (!this.activationForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.accountService.activateAccount(
        <User>{
          firstName: this.firstNameCtrl.value,
          lastName: this.lastNameCtrl.value,
          email: this.emailCtrl.value,
          password: this.passwordCtrl.value
        },
        this.tokenInfo.token,
        this.tokenInfo.companySiret
      ).subscribe(
        () => {
          this.loading = false;
          this.analyticsService.trackEvent(EventCategories.account, AccountEventActions.registerUser, ActionResultNames.success);
          this.showSuccess = true;
        },
        error => {
          this.loading = false;
          this.conflictError = false;
          if (error.status === HttpStatusCodes.CONFLICT) {
            this.conflictError = true;
            this.analyticsService.trackEvent(
              EventCategories.account,
              AccountEventActions.registerUser,
              AccountEventNames.userAlreadyRegistered
            );
          } else {
            this.loadingError = true;
            this.analyticsService.trackEvent(EventCategories.account, AccountEventActions.registerUser, ActionResultNames.fail);
          }
          this.showErrors = true;
        }
      );
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

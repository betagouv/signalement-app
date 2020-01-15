import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import { AnalyticsService, AuthenticationEventActions, EventCategories } from '../../../services/analytics.service';
import pages from '../../../../assets/data/pages.json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  loginForm: FormGroup;
  loginCtrl: FormControl;

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.login.forgotPassword.title);
    this.meta.updateTag({ name: 'description', content: pages.login.forgotPassword.description });
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginCtrl = this.formBuilder.control('', Validators.required);

    this.loginForm = this.formBuilder.group({
      login: this.loginCtrl
    });
  }

  submitLoginForm() {
    this.loadingError = false;
    this.showSuccess = false;
    this.showErrors = false;
    if (!this.loginForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.authenticationService.forgotPassword(this.loginCtrl.value).subscribe(
        _ => {
          this.loading = false;
          this.showSuccess = true;
          this.analyticsService.trackEvent(
            EventCategories.authentication,
            AuthenticationEventActions.forgotPasswordSuccess,
            this.loginCtrl.value
          );
        },
        error => {
          this.loading = false;
          this.loadingError = true;
          this.analyticsService.trackEvent(
            EventCategories.authentication,
            AuthenticationEventActions.forgotPasswordFail,
            this.loginCtrl.value
          );
        }
      );
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { AnalyticsService, AuthenticationEventActions, EventCategories } from '../../../services/analytics.service';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.scss']
})
export class PasswordForgotComponent implements OnInit {

  loginForm: FormGroup;
  loginCtrl: FormControl;

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private analyticsService: AnalyticsService,
  ) {
  }

  ngOnInit() {
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

import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { AnalyticsService, AuthenticationEventActions, EventCategories } from '../../services/analytics.service';
import { Router } from '@angular/router';
import { Roles } from '../../model/AuthUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginCtrl: FormControl;
  passwordCtrl: FormControl;

  showErrors: boolean;
  authenticationError: string;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle(pages.login.title);
    this.meta.updateTag({ name: 'description', content: pages.login.description });
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginCtrl = this.formBuilder.control('', Validators.required);
    this.passwordCtrl = this.formBuilder.control('', Validators.required);

    this.loginForm = this.formBuilder.group({
      login: this.loginCtrl,
      password: this.passwordCtrl
    });
  }

  submitLoginForm() {
    this.authenticationError = '';
    if (!this.loginForm.valid) {
      this.showErrors = true;
    } else {
      this.authenticationService.login(this.loginCtrl.value, this.passwordCtrl.value).subscribe(
        user => {
          this.analyticsService.trackEvent(EventCategories.authentication, AuthenticationEventActions.success, user.id);
          if (user.role === Roles.ToActivate.toString()) {
            this.router.navigate(['compte', 'activation']);
          } else {
            this.router.navigate(['suivi-des-signalements']);
          }
        },
        error => {
          this.analyticsService.trackEvent(EventCategories.authentication, AuthenticationEventActions.fail);
          this.authenticationError = `Echec de l'authentification`;
        }
      );
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

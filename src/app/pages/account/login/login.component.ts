import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import HttpStatusCodes from 'http-status-codes';
import pages from '../../../../assets/data/pages.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { AnalyticsService, AuthenticationEventActions, EventCategories } from '../../../services/analytics.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  isDgccrf = false;

  showErrors: boolean;
  loading: boolean;
  authenticationError: String;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.account.login.title);
    this.meta.updateTag({ name: 'description', content: pages.account.login.description });
    this.initLoginForm();

    this.route.url.subscribe(url => {
      if (url[0]) {
        this.isDgccrf = url[0].toString() === 'dgccrf';
      }
    });
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
    if (!this.loginForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.authenticationService.login(this.loginCtrl.value, this.passwordCtrl.value).subscribe(
        (user: User) => {
          this.loading = false;
          this.analyticsService.trackEvent(EventCategories.authentication, AuthenticationEventActions.success, user.id);
          this.analyticsService.trackEvent(EventCategories.authentication, AuthenticationEventActions.role, user.role );
          this.router.navigate(['suivi-des-signalements', user.roleUrlParam]);
        },
        error => {
          this.loading = false;
          this.analyticsService.trackEvent(EventCategories.authentication, AuthenticationEventActions.fail);
          const errorMapping = new Map([
            [HttpStatusCodes.FORBIDDEN, "Compte bloqué (trop de tentatives, veuillez réessayer dans 30 minutes)"],
            [HttpStatusCodes.LOCKED, "Votre adresse email doit être validée, un e-mail vient de vous être envoyé avec un lien à cet effet."]
          ]);
          this.authenticationError = errorMapping.get(error.status) || "Échec de l'authentification.";
        }
      );
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

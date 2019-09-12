import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { AnalyticsService, AuthenticationEventActions, EventCategories } from '../../services/analytics.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from '../../model/AuthUser';
import Utils from '../../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  isConnection = false;
  isDgccrf = false;

  showErrors: boolean;
  authenticationError: string;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.login.title);
    this.meta.updateTag({ name: 'description', content: pages.login.description });
    this.initLoginForm();

    this.route.url.subscribe(url => {
      if (url[0]) {
        this.isConnection = url[0].toString() === 'dgccrf' || url[0].toString() === 'connexion';
        this.isDgccrf = url[0].toString() === 'dgccrf';
      }

    });

    Utils.focusAndBlurOnTop();
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
          this.analyticsService.trackEvent(EventCategories.authentication, AuthenticationEventActions.role, user.role );

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

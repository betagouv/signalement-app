import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { AuthenticationService } from '../../services/authentication.service';
import { AnalyticsService, EventCategories, ChangePasswordEventActions } from '../../services/analytics.service';
import { Router } from '@angular/router';
import { User } from '../../model/AuthUser';

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
  newPasswordCtrl: FormControl;

  showErrors: boolean;
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
    this.oldPasswordCtrl = this.formBuilder.control('', Validators.required);
    this.newPasswordCtrl = this.formBuilder.control('', Validators.required);

    this.changePasswordForm = this.formBuilder.group({
      oldPasswordCtrl: this.oldPasswordCtrl,
      newPasswordCtrl: this.newPasswordCtrl
    });
  }

  submitForm() {
    this.authenticationError = '';
    if (!this.changePasswordForm.valid) {
      this.showErrors = true;
    } else {
      this.authenticationService.changePassword(this.user.email, this.oldPasswordCtrl.value, this.newPasswordCtrl.value)
      // .subscribe(
      //   user => {
      //     this.analyticsService.trackEvent(EventCategories.changePassword, ChangePasswordEventActions.success, (user as User).id);
      //     this.router.navigate(['suivi-des-signalements']);
      //   },
      //   error => {
      //     this.analyticsService.trackEvent(EventCategories.changePassword, ChangePasswordEventActions.fail);
      //     this.authenticationError = `Echec de l'authentification`;
      //   }
      // );
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActionResultNames, AnalyticsService, CompanyAccessEventActions, EventCategories } from '../../../services/analytics.service';
import { Router } from '@angular/router';
import pages from '../../../../assets/data/pages.json';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-company-activation',
  templateUrl: './company-activation.component.html',
  styleUrls: ['./company-activation.component.scss']
})
export class CompanyActivationComponent implements OnInit {

  activationForm: FormGroup;
  siretCtrl: FormControl;
  codeCtrl: FormControl;
  emailCtrl: FormControl;

  showErrors: boolean;
  activationError = false;

  isAuthenticated: boolean;
  loading: boolean;
  emailSent = false;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle(pages.account.activation.title);
    this.meta.updateTag({ name: 'description', content: pages.account.activation.description });
    this.initActivationForm();

    this.authenticationService.isAuthenticated()
      .pipe(take(1))
      .subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  initActivationForm() {
    this.siretCtrl = this.formBuilder.control('', [Validators.required, Validators.pattern('[0-9]{14}')]);
    this.codeCtrl = this.formBuilder.control('', [Validators.required, Validators.pattern('[0-9]{6}')]);
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);

    this.activationForm = this.formBuilder.group({
      siret: this.siretCtrl,
      code: this.codeCtrl,
      email: this.emailCtrl
    });
  }

  submitActivationForm() {
    if (RegExp(/^[0-9\s]+$/g).test(this.siretCtrl.value)) {
      this.siretCtrl.setValue((this.siretCtrl.value as string).replace(/\s/g, ''));
    }
    this.activationError = false;
    if (!this.activationForm.valid) {
      this.showErrors = true;
    } else {
      const handleError = (action: string) => {
        this.loading = false;
        this.analyticsService.trackEvent(EventCategories.companyAccess, action, ActionResultNames.fail);
        this.activationError = true;
      };

      this.loading = true;
      if (this.isAuthenticated) {
        this.authenticationService.acceptToken(this.siretCtrl.value, this.codeCtrl.value).subscribe(
          _ => {
            this.loading = false;
            this.analyticsService.trackEvent(
              EventCategories.account,
              CompanyAccessEventActions.addCompanyToAccount,
              ActionResultNames.success
            );
            this.router.navigate(['mes-entreprises']);
          },
          error => {
            handleError(CompanyAccessEventActions.addCompanyToAccount);
          }
        );
      } else {
        this.authenticationService.sendActivationLink(this.siretCtrl.value, this.codeCtrl.value, this.emailCtrl.value).subscribe(
          _ => {
            this.loading = false;
            this.emailSent = true;
            this.analyticsService.trackEvent(
              EventCategories.account,
              CompanyAccessEventActions.activateCompanyCode,
              ActionResultNames.success
            );
          },
          error => handleError(CompanyAccessEventActions.activateCompanyCode)
        );
      }
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

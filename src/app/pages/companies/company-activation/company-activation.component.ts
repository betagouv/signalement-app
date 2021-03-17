import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import {
  ActionResultNames,
  AnalyticAction,
  AnalyticsService,
  CompanyAccessEventActions,
  EventCategories
} from '../../../services/analytics.service';
import { Router } from '@angular/router';
import {pageDefinitions} from '../../../../assets/data/pages';
import { User } from '../../../model/AuthUser';

@Component({
  selector: 'app-company-activation',
  templateUrl: './company-activation.component.html',
  styleUrls: ['./company-activation.component.scss']
})
export class CompanyActivationComponent implements OnInit {

  readonly siretCtrl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{14}')]);
  readonly codeCtrl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}')]);
  readonly emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  readonly activationForm = new FormGroup({
    siret: this.siretCtrl,
    code: this.codeCtrl,
    email: this.emailCtrl
  });

  showErrors = false;
  activationError = false;

  connectedUser?: User;
  loading = false;
  emailSent = false;

  constructor(
    public formBuilder: FormBuilder,
    private titleService: Title,
    private meta: Meta,
    private authenticationService: AuthenticationService,
    private analyticsService: AnalyticsService,
    private router: Router) {
  }

  ngOnInit() {
    // this.titleService.setTitle(pages.account.activation.title);
    // this.meta.updateTag({ name: 'description', content: pages.account.activation.description });
    this.authenticationService.getConnectedUser().subscribe(_ => {
      this.connectedUser = _;
      this.emailCtrl.setValue(_?.email);
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
      const handleError = (action: AnalyticAction) => {
        this.loading = false;
        this.analyticsService.trackEvent(EventCategories.companyAccess, action, ActionResultNames.fail);
        this.activationError = true;
      };

      this.loading = true;
      if (this.emailCtrl.value === this.connectedUser?.email) {
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

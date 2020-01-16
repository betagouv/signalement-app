import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActionResultNames, AnalyticsService, CompanyAccessEventActions, EventCategories } from '../../../services/analytics.service';
import { Router } from '@angular/router';
import pages from '../../../../assets/data/pages.json';
import { take } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-company-activation',
  templateUrl: './company-activation.component.html',
  styleUrls: ['./company-activation.component.scss']
})
export class CompanyActivationComponent implements OnInit {

  activationForm: FormGroup;
  siretCtrl: FormControl;
  codeCtrl: FormControl;

  showErrors: boolean;
  activationError: string;

  isAuthenticated: boolean;
  loading: boolean;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private platformLocation: PlatformLocation) { }

  ngOnInit() {
    this.titleService.setTitle(pages.account.activation.title);
    this.meta.updateTag({ name: 'description', content: pages.account.activation.description });
    this.initActivationForm();

    this.authenticationService.isAuthenticated()
      .pipe(take(1))
      .subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  initActivationForm() {
    this.siretCtrl = this.formBuilder.control('', Validators.required);
    this.codeCtrl = this.formBuilder.control('', Validators.required);

    this.activationForm = this.formBuilder.group({
      siret: this.siretCtrl,
      code: this.codeCtrl
    });
  }

  submitActivationForm() {
    this.activationError = '';
    if (!this.activationForm.valid) {
      this.showErrors = true;
    } else {
      const handleError = (action: string) => {
        this.loading = false;
        this.analyticsService.trackEvent(EventCategories.companyAccess, action, ActionResultNames.fail);
        this.activationError = `Impossible d'activer ce compte. Veuillez vérifier le code d'accès et le SIRET`;
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
        this.authenticationService.fetchTokenInfo(this.siretCtrl.value, this.codeCtrl.value).subscribe(
          token => {
            this.loading = false;
            this.analyticsService.trackEvent(
              EventCategories.account,
              CompanyAccessEventActions.activateCompanyCode,
              ActionResultNames.success
            );
            this.router.navigate(['compte', 'inscription']);
          },
          error => handleError(CompanyAccessEventActions.activateCompanyCode)
        );
      }
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

  back() {
    this.platformLocation.back();
  }

}

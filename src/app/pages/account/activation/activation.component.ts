import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../services/authentication.service';
import { AccountEventActions, AnalyticsService, EventCategories } from '../../../services/analytics.service';
import { ActivatedRoute, Router } from '@angular/router';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

  activationForm: FormGroup;
  siretCtrl: FormControl;
  codeCtrl: FormControl;

  showErrors: boolean;
  activationError: string;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private analyticsService: AnalyticsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.account.activation.title);
    this.meta.updateTag({ name: 'description', content: pages.account.activation.description });
    this.initActivationForm();
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
      const handleError = () => {
        this.analyticsService.trackEvent(EventCategories.account, AccountEventActions.activateAccountFail);
        this.activationError = `Impossible de vous identifier. Veuillez vérifier le code d'accès et le SIRET`;
      };
      this.authenticationService.fetchTokenInfo(this.siretCtrl.value, this.codeCtrl.value).subscribe(
        token => {
          this.analyticsService.trackEvent(EventCategories.account, AccountEventActions.activateAccountSuccess);
          this.router.navigate(['compte', 'activation']);
        },
        error => handleError()
      );
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

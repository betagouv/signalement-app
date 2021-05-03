import { Component, OnInit } from '@angular/core';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute } from '@angular/router';
import { accessLevels } from '../common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-invitation',
  templateUrl: './company-invitation.component.html'
})
export class CompanyInvitationComponent implements OnInit {

  constructor(public formBuilder: FormBuilder,
    private companyAccessesService: CompanyAccessesService,
    private route: ActivatedRoute) {
  }

  accessLevels = accessLevels;
  siret?: string;

  readonly emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  readonly levelCtrl = new FormControl('', [Validators.required]);
  readonly invitationForm = this.formBuilder.group({
    email: this.emailCtrl,
    level: this.levelCtrl,
  });

  loading = false;
  showSuccess = false;
  showErrors = false;

  ngOnInit() {
    this.siret = this.route.snapshot.paramMap.get('siret') ?? undefined;
  }

  submitForm() {
    this.showSuccess = false;
    this.showErrors = false;
    if (this.invitationForm.valid && this.siret) {
      this.loading = true;
      this.companyAccessesService.sendInvitation(
        this.siret,
        this.emailCtrl.value,
        this.levelCtrl.value
      ).subscribe(() => {
        this.loading = false;
        this.showSuccess = true;
      }, err => {
        this.loading = false;
        this.showErrors = true;
      });
    } else {
      this.loading = false;
      this.showErrors = true;
    }
  }
}

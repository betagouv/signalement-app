import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
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
    private titleService: Title,
    private meta: Meta,
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
    this.titleService.setTitle(`Entreprise ${this.siret} - ${pages.companies.companyInvitation.title}`);
    this.meta.updateTag({ name: 'description', content: pages.companies.companyInvitation.description });
  }

  submitForm() {
    this.showSuccess = false;
    if (this.invitationForm.valid && this.siret) {
      this.loading = true;
      this.companyAccessesService
          .sendInvitation(
            this.siret,
            this.emailCtrl.value,
            this.levelCtrl.value
          )
          .subscribe(() => {
            this.loading = false;
            this.showSuccess = true;
          });
    } else {
      this.showErrors = true;
    }
  }
}

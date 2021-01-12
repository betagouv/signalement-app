import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute } from '@angular/router';
import { accessLevels } from '../common';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-invitation',
  templateUrl: './company-invitation.component.html'
})
export class CompanyInvitationComponent implements OnInit {

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private companyAccessesService: CompanyAccessesService,
              private route: ActivatedRoute) { }

  accessLevels = accessLevels;
  siret?: string;

  readonly invitationForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    level: ['', [Validators.required]],
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
            this.invitationForm.get('emailCtrl')!.value,
            this.invitationForm.get('levelCtrl')!.value
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

import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute } from '@angular/router';
import { accessLevels } from '../common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  siret: string;

  invitationForm: FormGroup;
  emailCtrl: FormControl;
  levelCtrl: FormControl;

  loading: boolean;
  showSuccess = false;
  showErrors = false;

  ngOnInit() {
    this.titleService.setTitle(pages.secured.companyInvitation.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.companyInvitation.description });
    this.initForm();
  }

  initForm() {
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.levelCtrl = this.formBuilder.control('', [Validators.required]);

    this.invitationForm = this.formBuilder.group({
      email: this.emailCtrl,
      level: this.levelCtrl,
    });
  }

  submitForm() {
    this.showSuccess = false;
    this.loading = true;
    if (this.invitationForm.valid) {
      this.companyAccessesService
          .sendInvitation(
            this.route.snapshot.paramMap.get('siret'),
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

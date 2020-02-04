import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { AccountService } from '../../../services/account.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private accountService: AccountService,
              private route: ActivatedRoute) { }

  invitationForm: FormGroup;
  emailCtrl: FormControl;

  loading: boolean;
  showSuccess = false;
  showErrors = false;

  ngOnInit() {
    this.titleService.setTitle(pages.secured.admin.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.admin.description });
    this.initForm();
  }

  initForm() {
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);

    this.invitationForm = this.formBuilder.group({
      email: this.emailCtrl
    });
  }

  submitForm() {
    this.showSuccess = false;
    this.loading = true;
    if (this.invitationForm.valid) {
      this.accountService
          .sendDGCCRFInvitation(
            this.emailCtrl.value
          )
          .subscribe(() => {
            this.loading = false;
            this.showSuccess = true;
            this.emailCtrl.reset();
          });
    } else {
      this.showErrors = true;
    }
  }
}

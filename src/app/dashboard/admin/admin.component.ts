import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { PendingDGCCRF } from '../../model/PendingDGCCRF';
import { User } from '../../model/AuthUser';

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

  readonly invitationForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  loading = false;
  usersDGCCRF?: User[];
  pendingDGCCRF?: PendingDGCCRF[];
  showSuccess = false;
  showErrors = false;
  emailRejectedError?: string;

  ngOnInit() {
    this.titleService.setTitle(pages.secured.admin.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.admin.description });
  }

  showPendingDGCCRF() {
    this.loading = true;
    this.pendingDGCCRF = undefined;
    this.usersDGCCRF = undefined;
    this.accountService.listDGCCRFInvitations().subscribe(
      pendingDGCCRF => {
        this.loading = false;
        this.pendingDGCCRF = pendingDGCCRF;
      }
    );
  }

  showUsersDGCCRF() {
    this.loading = true;
    this.pendingDGCCRF = undefined;
    this.usersDGCCRF = undefined;
    this.accountService.listDGCCRFUsers().subscribe(
      users => {
        this.loading = false;
        this.usersDGCCRF = users;
      }
    );
  }

  submitForm() {
    this.emailRejectedError = undefined;
    this.showSuccess = false;
    this.loading = true;
    if (this.invitationForm.valid) {
      this.accountService
          .sendDGCCRFInvitation(
            this.invitationForm.get('email')!.value
          )
          .subscribe(() => {
            this.loading = false;
            this.showSuccess = true;
            this.pendingDGCCRF = undefined;
            this.usersDGCCRF = undefined;
            this.invitationForm.get('email')!.reset();
          }, (err) => {
            this.loading = false;
            this.emailRejectedError = err.error;
          });
    } else {
      this.showErrors = true;
    }
  }
}

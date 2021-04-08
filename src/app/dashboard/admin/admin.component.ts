import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PendingDGCCRF } from '../../model/PendingDGCCRF';
import { User } from '../../model/AuthUser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  constructor(public formBuilder: FormBuilder,
              private accountService: AccountService) { }

  readonly emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  readonly invitationForm = this.formBuilder.group({
    email: this.emailCtrl,
  });

  loading = false;
  fetching = false;
  usersDGCCRF?: User[];
  pendingDGCCRF?: PendingDGCCRF[];
  showSuccess = false;
  showErrors = false;
  emailRejectedError?: string;


  showPendingDGCCRF() {
    this.fetching = true;
    this.pendingDGCCRF = undefined;
    this.usersDGCCRF = undefined;
    this.accountService.listDGCCRFInvitations().subscribe(
      pendingDGCCRF => {
        this.fetching = false;
        this.pendingDGCCRF = pendingDGCCRF;
      }
    );
  }

  showUsersDGCCRF() {
    this.fetching = true;
    this.pendingDGCCRF = undefined;
    this.usersDGCCRF = undefined;
    this.accountService.listDGCCRFUsers().subscribe(
      users => {
        this.fetching = false;
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
            this.emailCtrl.value
          )
          .subscribe(() => {
            this.loading = false;
            this.showSuccess = true;
            this.pendingDGCCRF = undefined;
            this.usersDGCCRF = undefined;
            this.emailCtrl.reset();
          }, (err) => {
            this.loading = false;
            this.emailRejectedError = err.error;
          });
    } else {
      this.loading = false;
      this.showErrors = true;
    }
  }
}

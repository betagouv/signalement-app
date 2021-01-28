import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Company, UserAccess } from '../../../model/Company';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { Permissions, User } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent implements OnInit {

  @Input() userAccess!: UserAccess;
  @Output() change = new EventEmitter<Company>();

  user?: User;
  readonly permissions = Permissions;

  bsModalRef?: BsModalRef;

  readonly companyNameCtrl = new FormControl('', Validators.required);
  readonly line1Ctrl = new FormControl('', Validators.required);
  readonly line2Ctrl = new FormControl('');
  readonly line3Ctrl = new FormControl('');
  readonly postalCodeCtrl = new FormControl('', [Validators.required, Validators.pattern('[0-9]{5}')]);
  readonly cityCtrl = new FormControl('', Validators.required);
  readonly activationDocumentRequiredCtrl = new FormControl(false);
  readonly companyAddressForm = this.formBuilder.group({
    companyName: this.companyNameCtrl,
    line1: this.line1Ctrl,
    line2: this.line2Ctrl,
    line3: this.line3Ctrl,
    postalCode: this.postalCodeCtrl,
    city: this.cityCtrl,
  });

  loading = false;
  loadingError = false;

  constructor(private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private companyService: CompanyService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.user.subscribe((user: User) => this.user = user);
    this.companyNameCtrl.setValue(this.userAccess?.companyAddress.split('-')[0] ?? '');
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template);
  }

  submitCompanyAddressForm() {
    this.loading = true;
    this.loadingError = false;
    this.companyService.updateCompanyAddress(
      this.userAccess.companySiret,
      [
        this.companyNameCtrl.value,
        this.line1Ctrl.value,
        this.line2Ctrl.value,
        this.line3Ctrl.value,
        `${this.postalCodeCtrl.value} ${this.cityCtrl.value}`
      ].filter(l => l).reduce((prev, curr) => `${prev} - ${curr}`),
      this.postalCodeCtrl.value,
      this.activationDocumentRequiredCtrl.value
    ).subscribe(
      company => {
        this.loading = false;
        this.change.emit(company);
        this.bsModalRef!.hide();
      },
      _ => {
        this.loading = false;
        this.loadingError = true;
      });
  }
}

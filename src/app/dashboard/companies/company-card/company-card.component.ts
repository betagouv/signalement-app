import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { AccessLevel, Company } from '../../../model/Company';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CompaniesService } from '../../../services/company.service';
import { Permissions, User } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { Address } from '../../../model/Address';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent implements OnInit {

  @Input() userAccess!: Company;

  @Input() level!: AccessLevel;

  @Output() change = new EventEmitter<Company>();

  user?: User;
  readonly permissions = Permissions;

  bsModalRef?: BsModalRef;

  readonly activationDocumentRequiredCtrl = new FormControl(false);
  readonly companyAddressForm = this.formBuilder.group({
    address: this.formBuilder.group({
      number: ['', Validators.required],
      street: ['', Validators.required],
      addressSupplement: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      city: ['', Validators.required],
    }),
    activationDocumentRequired: this.activationDocumentRequiredCtrl
  });

  constructor(private formBuilder: FormBuilder,
    private modalService: BsModalService,
    public companyService: CompaniesService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.user.subscribe((user: User | undefined) => this.user = user);
    if (this.userAccess?.address) {
      this.companyAddressForm.patchValue({
        address: this.userAccess.address,
      });
    }
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template);
  }

  submitCompanyAddressForm() {
    this.companyService.update(
      this.userAccess.id, {
        address: this.companyAddressForm.get('address').value as Address,
        activationDocumentRequired: this.activationDocumentRequiredCtrl.value,
      }
    ).subscribe(company => {
      this.change.emit(company);
      this.bsModalRef!.hide();
    });
  }
}

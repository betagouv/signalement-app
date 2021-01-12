import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Company, UserAccess } from '../../../model/Company';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
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

  readonly companyAddressForm = this.formBuilder.group({
    line1: ['', Validators.required],
    line2: [''],
    line3: [''],
    postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    city: ['', Validators.required],
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
        this.userAccess.companyName,
        this.companyAddressForm.get('line1')!.value,
        this.companyAddressForm.get('line2')!.value,
        this.companyAddressForm.get('line3')!.value,
        `${this.companyAddressForm.get('postalCode')!.value} ${this.companyAddressForm.get('city')!.value}`
      ].filter(l => l).reduce((prev, curr) => `${prev} - ${curr}`, ''),
      this.companyAddressForm.get('postalCode')!.value
    ).subscribe(
      company => {
        this.loading = false;
        this.change.emit(company);
        this.bsModalRef!.hide();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }
}

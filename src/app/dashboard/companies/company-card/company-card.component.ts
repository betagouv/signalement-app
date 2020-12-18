import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Company, UserAccess } from '../../../model/Company';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { Permissions, User } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';

;

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent implements OnInit {

  @Input() userAccess: UserAccess;
  @Output() change = new EventEmitter<Company>();

  user: User;
  permissions = Permissions;

  bsModalRef: BsModalRef;
  companyAddressForm: FormGroup;
  line1Ctrl: FormControl;
  line2Ctrl: FormControl;
  line3Ctrl: FormControl;
  postalCodeCtrl: FormControl;
  cityCtrl: FormControl;

  loading: boolean;
  loadingError: boolean;

  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private companyService: CompanyService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.user.subscribe(user => this.user = user);

    this.initCompanyAddressForm();
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template);
  }

  initCompanyAddressForm() {
    this.line1Ctrl = this.formBuilder.control('', Validators.required);
    this.line2Ctrl = this.formBuilder.control('');
    this.line3Ctrl = this.formBuilder.control('');
    this.postalCodeCtrl = this.formBuilder.control('', [Validators.required, Validators.pattern('[0-9]{5}')]);
    this.cityCtrl = this.formBuilder.control('', Validators.required);

    this.companyAddressForm = this.formBuilder.group({
      line1: this.line1Ctrl,
      line2: this.line2Ctrl,
      line3: this.line3Ctrl,
      postalCode: this.postalCodeCtrl,
      city: this.cityCtrl,
    });
  }

  submitCompanyAddressForm() {
    this.loading = true;
    this.loadingError = false;
    this.companyService.updateCompanyAddress(
      this.userAccess.companySiret,
      [
        this.userAccess.companyName,
        this.line1Ctrl.value,
        this.line2Ctrl.value,
        this.line3Ctrl.value,
        `${this.postalCodeCtrl.value} ${this.cityCtrl.value}`
      ].filter(l => l).reduce((prev, curr) => `${prev} - ${curr}`, ''),
      this.postalCodeCtrl.value
    ).subscribe(
      company => {
        this.loading = false;
        this.change.emit(company);
        this.bsModalRef.hide();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

}

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { UserAccess } from '../../../model/CompanyAccess';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from '../../../model/Company';
import { CompanyService } from '../../../services/company.service';
import { Permissions } from '../../../model/AuthUser';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent implements OnInit {

  @Input() userAccess: UserAccess;
  @Output() change = new EventEmitter<Company>();

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
              private companyService: CompanyService) { }

  ngOnInit() {
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
      Object.assign(new Company(), {
        name: this.userAccess.companyName,
        line1: this.userAccess.companyName,
        line2: this.line1Ctrl.value,
        line3: this.line2Ctrl.value,
        line4: this.line3Ctrl.value,
        line5: `${this.postalCodeCtrl.value} ${this.cityCtrl.value}`,
        postalCode: this.postalCodeCtrl.value,
      }).address,
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

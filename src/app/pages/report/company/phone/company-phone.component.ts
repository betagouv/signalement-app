import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DraftReport } from '../../../../model/Report';
import { CustomValidators } from '../../../../custom-validators';
import Utils from '../../../../utils';

@Component({
  selector: 'app-company-phone',
  templateUrl: './company-phone.component.html',
  styleUrls: ['./company-phone.component.scss']
})
export class CompanyPhoneComponent implements OnInit {

  constructor(public formBuilder: FormBuilder) { }

  @Input() draftReport?: DraftReport;

  @Output() complete = new EventEmitter<string>();

  @Output() change = new EventEmitter();

  readonly phoneCtrl = this.formBuilder.control('', [
    Validators.required,
    CustomValidators.validatePhoneNumber
  ]);
  readonly phoneForm = this.formBuilder.group({
    phone: this.phoneCtrl
  });

  ngOnInit(): void {
    const inputPhone = this.draftReport?.draftCompany?.phone;
    if (inputPhone) {
      this.phoneCtrl.setValue(inputPhone);
    }
  }

  submitPhone() {
    if (this.phoneForm.valid) {
      this.phoneForm.disable();
      this.complete.emit(Utils.sanitizePhoneNumber(this.phoneCtrl.value));
    }
  }

  changePhone() {
    this.phoneForm.enable();
    this.change.emit();
  }

  readonly showError = () => this.phoneForm.touched && this.phoneForm.invalid && this.phoneForm.dirty;
}

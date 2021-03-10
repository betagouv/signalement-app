import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnalyticsService, CompanySearchEventActions, EventCategories } from '../../../../services/analytics.service';
import { DraftReport } from '../../../../model/Report';
import { CustomValidators } from '../../../../custom-validators';
import Utils from '../../../../utils';
import { DraftCompany } from '../../../../model/Company';

@Component({
  selector: 'app-company-location',
  templateUrl: './company-location.component.html',
  styleUrls: ['./company-location.component.scss']
})
export class CompanyLocationComponent implements OnInit {

  @Input() draftReport?: DraftReport;

  @Output() complete = new EventEmitter<DraftCompany>();
  @Output() change = new EventEmitter();

  addressCtrl: FormControl;
  postalCodeCtrl: FormControl;
  locationForm: FormGroup;

  showErrors = false;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.addressCtrl  = this.formBuilder.control('', Validators.required);
    this.postalCodeCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{5}')]));
    this.locationForm = this.formBuilder.group({
      address: this.addressCtrl,
      postalCode: this.postalCodeCtrl
    });
  }

  submitLocation() {
    this.showErrors = false;
    if (!this.locationForm.valid) {
      this.showErrors = true;
    } else {
      this.locationForm.disable();
      this.complete.emit({
        address: this.addressCtrl.value,
        postalCode: this.postalCodeCtrl.value
      }) ;
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}
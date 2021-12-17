import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DraftCompany } from '@signal-conso/signalconso-api-sdk-js';
import { DraftReport } from '../../../../model/Report';

@Component({
  selector: 'app-company-location',
  templateUrl: './company-location.component.html',
  styleUrls: ['./company-location.component.scss']
})
export class CompanyLocationComponent implements OnInit {


  @Input() draftReport: DraftReport;

  @Output() complete = new EventEmitter<Partial<DraftCompany>>();
  @Output() change = new EventEmitter();

  addressCtrl: FormControl;
  postalCodeCtrl: FormControl;
  locationForm: FormGroup;

  showErrors = false;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.addressCtrl  = this.formBuilder.control('', Validators.required);
    this.postalCodeCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{5}')]));
    this.locationForm = this.formBuilder.group({postalCode: this.postalCodeCtrl
    });

    if (!this.draftReport.isVendor) {
      this.locationForm.addControl('address', this.addressCtrl);
    }
  }

  submitLocation() {
    this.showErrors = false;
    if (!this.locationForm.valid) {
      this.showErrors = true;
    } else {
      this.locationForm.disable();
      this.complete.emit({
        address: {
          street: this.addressCtrl?.value,
          postalCode: this.postalCodeCtrl.value
        },
      });
    }
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

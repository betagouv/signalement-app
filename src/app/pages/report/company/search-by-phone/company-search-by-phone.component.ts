import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AnalyticsService, CompanySearchEventActions, EventCategories } from '../../../../services/analytics.service';
import { DraftReport } from '../../../../model/Report';
import { CustomValidators } from '../../../../custom-validators';
import Utils from '../../../../utils';

@Component({
  selector: 'app-company-search-by-phone',
  templateUrl: './company-search-by-phone.component.html',
  styleUrls: ['./company-search-by-phone.component.scss']
})
export class CompanySearchByPhoneComponent implements OnInit {

  @Input() draftReport?: DraftReport;

  @Output() complete = new EventEmitter<string>();
  @Output() change = new EventEmitter();

  phoneCtrl: FormControl;
  phoneForm: FormGroup;

  showErrors = false;

  constructor(public formBuilder: FormBuilder,
              private analyticsService: AnalyticsService) { }

  ngOnInit(): void {

    this.phoneCtrl  = this.formBuilder.control(this.draftReport?.draftCompany?.phone ?? '', [
      Validators.required,
      CustomValidators.validatePhoneNumber
    ]);
    this.phoneForm = this.formBuilder.group({
      phone: this.phoneCtrl
    });
  }

  submitPhone() {
    this.showErrors = false;
    if (!this.phoneForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.searchByPhone, this.phoneCtrl.value);
      this.phoneForm.disable();
      this.complete.emit(Utils.sanitizePhoneNumber(this.phoneCtrl.value));
    }
  }

  changePhone() {
    this.phoneForm.enable();
    this.change.emit();
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }

}

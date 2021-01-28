import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AnalyticsService, CompanySearchEventActions, EventCategories } from '../../../../services/analytics.service';
import { DraftReport } from '../../../../model/Report';

@Component({
  selector: 'app-company-search-by-phone',
  templateUrl: './company-search-by-phone.component.html',
  styleUrls: ['./company-search-by-phone.component.scss']
})
export class CompanySearchByPhoneComponent implements OnInit {

  @Input() draftReport?: DraftReport;

  @Output() complete = new EventEmitter<string>();
  @Output() change = new EventEmitter();

  readonly phoneCtrl = this.formBuilder.control(this.draftReport?.draftCompany.phone ?? '', Validators.required);
  readonly phoneForm = this.formBuilder.group({
    phone: this.phoneCtrl
  });

  showErrors = false;

  constructor(public formBuilder: FormBuilder,
              private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
  }

  submitPhone() {
    this.showErrors = false;
    if (!this.phoneForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.companySearch, CompanySearchEventActions.searchByPhone, this.phoneCtrl.value);
      this.phoneForm.disable();
      this.complete.emit(this.phoneCtrl.value);
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

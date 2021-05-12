import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RendererService } from '../../../../services/renderer.service';
import { DraftCompany } from '../../../../model/Company';
import { ConstantService } from '../../../../services/constant.service';

export const foreignFormValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const isForeign = control.get('isForeign');
  const name = control.get('name');
  const country = control.get('country');

  return isForeign.value === IsForeignValues.true && (!name.value || !country.value) ? { required: true } : null;
};

export enum IsForeignValues {'true', 'false', 'unknown'}

@Component({
  selector: 'app-company-foreign-country',
  templateUrl: './company-foreign-country.component.html',
  styleUrls: ['./company-foreign-country.component.scss', '../company.component.scss']
})
export class CompanyForeignCountryComponent implements OnInit {

  @ViewChild('foreignFormElt')
  private foreignFormElt: ElementRef;
  @ViewChild('foreignInputsElt')
  private foreignInputsElt: ElementRef;

  @Input() forceForeign;
  @Input() isVendor: boolean;
  @Output() complete = new EventEmitter<DraftCompany>();

  foreignForm: FormGroup;
  postalCodeCtrl: FormControl;
  isForeignCtrl: FormControl;
  nameCtrl: FormControl;
  countryCtrl: FormControl;
  countries: string[];
  isForeignValues = IsForeignValues;

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder,
              private constantService: ConstantService,
              private rendererService: RendererService) { }

  ngOnInit(): void {
    this.initForeignForm();
    this.constantService.getCountries()
      .subscribe(
      countries => this.countries = countries.map(country => country.name).filter(name => name !== 'France')
      );
  }

  initForeignForm() {
    this.postalCodeCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{5}')]));
    this.isForeignCtrl = this.formBuilder.control(this.forceForeign ? IsForeignValues.true : '', Validators.required);
    this.nameCtrl = this.formBuilder.control('');
    this.countryCtrl = this.formBuilder.control('');
    this.foreignForm = this.formBuilder.group({
      postalCodeCtrl: this.postalCodeCtrl,
      isForeign: this.isForeignCtrl,
      name: this.nameCtrl,
      country: this.countryCtrl,
    }, { validators: foreignFormValidator });
  }

  submitForeignForm() {
    if (this.countryCtrl.value) {
      this.checkCountryValue();
    }
    this.showErrors = false;
    if (!this.foreignForm.valid) {
      this.showErrors = true;
    } else {
      if (this.isForeignCtrl.value === IsForeignValues.true) {
        this.complete.emit({
          name: this.nameCtrl.value,
          country: this.countryCtrl.value,
          postalCode: this.postalCodeCtrl.value,
        }) ;
      } else {
        this.complete.emit({
          postalCode: this.postalCodeCtrl.value,
        });
      }
    }
  }

  checkCountryValue() {
    if (this.countries.indexOf(this.countryCtrl.value) === -1) {
      this.countryCtrl.reset();
    }
  }

}

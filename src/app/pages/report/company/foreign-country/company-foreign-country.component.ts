import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import countries from '../../../../../assets/data/countries.json';
import { RendererService } from '../../../../services/renderer.service';
import { DraftCompany } from '../../../../model/Company';

export const foreignFormValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const isForeign = control.get('isForeign');
  const name = control.get('name');
  const country = control.get('country');

  return isForeign.value && (!name.value || !country.value) ? { required: true } : null;
};

export enum IsForeignValues {'true', 'false', 'unknown'}

@Component({
  selector: 'app-company-foreign-country',
  templateUrl: './company-foreign-country.component.html',
  styleUrls: ['./company-foreign-country.component.scss']
})
export class CompanyForeignCountryComponent implements OnInit {

  @ViewChild('foreignFormElt')
  private foreignFormElt: ElementRef;
  @ViewChild('foreignInputsElt')
  private foreignInputsElt: ElementRef;

  @Input() forceForeign;
  @Output() complete = new EventEmitter<DraftCompany>();

  foreignForm: FormGroup;
  isForeignCtrl: FormControl;
  nameCtrl: FormControl;
  countryCtrl: FormControl;
  countries: string[] = countries.map(country => country.name).filter(name => name !== 'France');
  isForeignValues = IsForeignValues;

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder,
              private rendererService: RendererService) { }

  ngOnInit(): void {
    this.initForeignForm();
  }

  initForeignForm() {
    this.isForeignCtrl = this.formBuilder.control(this.forceForeign ? IsForeignValues.true : '', Validators.required);
    this.nameCtrl = this.formBuilder.control('');
    this.countryCtrl = this.formBuilder.control('');
    this.foreignForm = this.formBuilder.group({
      isForeign: this.isForeignCtrl,
      name: this.nameCtrl,
      country: this.countryCtrl,
    }, { validators: foreignFormValidator });
  }

  submitForeignForm() {
    this.showErrors = false;
    if (!this.foreignForm.valid) {
      this.showErrors = true;
    } else {
      if (this.isForeignCtrl.value === IsForeignValues.true) {
        this.complete.emit({
          name: this.nameCtrl.value,
          country: this.countryCtrl.value
        }) ;
      } else {
        this.complete.emit({});
      }
    }
  }

  countryTypeaheadOnBlur() {
    if (this.countries.indexOf(this.countryCtrl.value) === -1) {
      this.countryCtrl.reset();
    }
  }

}

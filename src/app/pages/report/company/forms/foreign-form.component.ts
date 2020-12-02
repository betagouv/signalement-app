import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import countries from '../../../../../assets/data/countries.json';
import { RendererService } from '../../../../services/renderer.service';
import { Subcategory } from '../../../../model/Anomaly';
import { DraftCompany } from '../../../../model/Company';

export const foreignFormValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const isForeign = control.get('isForeign');
  const name = control.get('name');
  const country = control.get('country');

  return isForeign.value && (!name.value || !country.value) ? { required: true } : null;
};

@Component({
  selector: 'app-foreign-form',
  templateUrl: './foreign-form.component.html',
  styleUrls: ['./foreign-form.component.scss']
})
export class ForeignFormComponent implements OnInit {

  @ViewChild('foreignInputs')
  private foreignInputs: ElementRef;

  @Output() complete = new EventEmitter<DraftCompany>();

  foreignForm: FormGroup;
  isForeignCtrl: FormControl;
  nameCtrl: FormControl;
  countryCtrl: FormControl;
  countries = countries.map(country => country.nom.toUpperCase()).filter(name => name !== 'FRANCE');

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder,
              private rendererService: RendererService) { }

  ngOnInit(): void {
    this.initForeignForm();
  }

  initForeignForm() {
    this.isForeignCtrl = this.formBuilder.control('', Validators.required);
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
      if (this.isForeignCtrl.value) {
        this.complete.emit({
          name: this.nameCtrl.value,
          country: this.countryCtrl.value
        }) ;
      } else {
        this.complete.emit({});
      }
    }
  }

}

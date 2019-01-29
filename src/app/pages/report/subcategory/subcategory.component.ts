import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subcategory } from '../../../model/Anomaly';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  @Input() initialValue: Subcategory;
  @Input() anomalySubcategories: Subcategory[];

  subcategoryForm: FormGroup;
  anomalySubcategoryCtrl: FormControl;

  showErrors: boolean;

  @Output() validate = new EventEmitter<Subcategory>();

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initSubcategoryForm();
  }

  initSubcategoryForm() {
    this.showErrors = false;

    this.anomalySubcategoryCtrl = this.formBuilder.control(this.initialValue ? this.initialValue.title : '', Validators.required);

    this.subcategoryForm = this.formBuilder.group({
      anomalySubcategory: this.anomalySubcategoryCtrl
    });
  }

  submitSubcategoryForm() {
    if (!this.subcategoryForm.valid) {
      this.showErrors = true;
      return false;
    } else {
      this.validate.emit(
        this.anomalySubcategories.find(subcategory => subcategory.title === this.anomalySubcategoryCtrl.value)
      );
    }
  }

  isTruncable(text: string) {
    return text && text.length > 100;
  }

  reverseDescriptionDisplay(subcategory: Subcategory) {
    subcategory.fullDescriptionDisplayed = !subcategory.fullDescriptionDisplayed;
  }
}

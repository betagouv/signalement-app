import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subcategory } from '../../../../model/Anomaly';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit, OnChanges {

  @Input() subcategories: Subcategory[];
  @Input() subcategoriesSelected: Subcategory[];
  @Input() subcategoriesTitle: string;
  @Input() subcategoryName: string;

  subcategoryForm: FormGroup;
  subcategoryTitleCtrl: FormControl;
  subcategorySelected: Subcategory;

  @Output() select = new EventEmitter<Subcategory[]>();

  showErrors: boolean;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subcategoryName']) {
      this.initSubcategoryForm();
    }
  }

  initSubcategoryForm() {
    this.showErrors = false;
    this.subcategorySelected = undefined;
    if (this.subcategoriesSelected && this.subcategoriesSelected.length) {
      this.subcategorySelected = this.subcategoriesSelected.shift();
    }

    this.subcategoryTitleCtrl = this.formBuilder.control(this.subcategorySelected ? this.subcategorySelected.title : '', Validators.required);
    this.subcategoryForm = this.formBuilder.group({});
    this.subcategoryForm.addControl(this.subcategoryName, this.subcategoryTitleCtrl);
  }

  selectSubcategory(subcategory: Subcategory) {
    this.subcategorySelected = subcategory;
    this.subcategoriesSelected = [];
  }

  submitSubcategoryForm() {
    if (!this.subcategoryForm.valid) {
      this.showErrors = true;
    } else {
      this.select.emit([this.subcategories.find(s => s.title === this.subcategoryTitleCtrl.value)]);
    }
  }

  hasSubSubcategory() {
    return this.subcategorySelected && this.subcategorySelected.subcategories;
  }

  onSelectSubSubcategories(subSubcategories: Subcategory[]) {
    this.select.emit([this.subcategories.find(s => s.title === this.subcategoryTitleCtrl.value), ...subSubcategories]);
  }


}

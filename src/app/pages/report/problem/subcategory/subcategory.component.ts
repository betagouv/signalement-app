import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subcategory } from '../../../../model/Anomaly';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  @Input() subcategories: Subcategory[];
  @Input() subcategoryTitle: string;
  @Input() subcategoryName: string;

  selectedSubcategory: Subcategory;
  @Output() select = new EventEmitter<Subcategory>();

  constructor() { }

  ngOnInit() {}

  selectSubcategory(subcategory: Subcategory) {
    this.selectedSubcategory = subcategory;
    if (!this.selectedSubcategory.subcategories) {
      this.select.emit(this.selectedSubcategory);
    }
  }

  hasSubSubcategory() {
    return this.selectedSubcategory && this.selectedSubcategory.subcategories;
  }

  onSelectSubSubcategory(subcategory: Subcategory) {
    this.select.emit(this.selectedSubcategory);
  }

}

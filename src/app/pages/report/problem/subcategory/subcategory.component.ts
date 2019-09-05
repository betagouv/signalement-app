import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { Subcategory } from '../../../../model/Anomaly';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var jQuery: any;

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
})
export class SubcategoryComponent implements OnInit, OnChanges {

  @Input() subcategories: Subcategory[];
  @Input() subcategoriesSelected: Subcategory[];
  @Input() subcategoriesTitle: string;
  @Input() subcategoryDescription: string;
  @Input() subcategoryName: string;
  @Input() firstLevel: boolean;

  subcategoryForm: FormGroup;
  subcategoryTitleCtrl: FormControl;
  subcategorySelected: Subcategory;

  @Output() select = new EventEmitter<Subcategory[]>();

  showErrors: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private renderer: Renderer2,
              public elementRef: ElementRef) { }


  ngOnInit() {

    if (this.firstLevel) {
      this.manageFirstInput((firstInput) => firstInput.focus());
    }

  }

  manageFirstInput(callback) {
    setTimeout(() => {
      const allForms: Array<HTMLElement> = Array.from(document.querySelectorAll('.subForm'));
      const lastForm = allForms[allForms.length - 1];

      if (lastForm) {
        const firstInput: HTMLElement = lastForm.querySelector('input:first-child');

        if (firstInput) {
          callback(firstInput);
        }
      }

    }, 100);

  }

  scrollToElement() {
    jQuery('html, body').animate({
      scrollTop: this.elementRef.nativeElement.offsetTop
    }, 1000);

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
    this.subcategoryTitleCtrl = this.formBuilder.control(
      this.subcategorySelected ? this.subcategorySelected.title : '', Validators.required
    );
    this.subcategoryForm = this.formBuilder.group({});
    this.subcategoryForm.addControl(this.subcategoryName, this.subcategoryTitleCtrl);
  }

  selectSubcategory(subcategory: Subcategory) {

    this.subcategorySelected = subcategory;
    this.subcategoriesSelected = [];

    this.manageFirstInput(() => this.scrollToElement());
  }

  submitSubcategoryForm() {
    if (!this.subcategoryForm.valid) {
      this.showErrors = true;
    } else {
      this.select.emit([this.subcategories.find(s => s.title === this.subcategoryTitleCtrl.value)]);
    }
  }

  isSubcategorySelected(subcategory: Subcategory) {
    return this.subcategorySelected && this.subcategorySelected.title === subcategory.title;
  }

  hasSubSubcategory() {
    return this.subcategorySelected && this.subcategorySelected.subcategories;
  }

  onSelectSubSubcategories(subSubcategories: Subcategory[]) {
    this.select.emit([this.subcategories.find(s => s.title === this.subcategoryTitleCtrl.value), ...subSubcategories]);

  }

}

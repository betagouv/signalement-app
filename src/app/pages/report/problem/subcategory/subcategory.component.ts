import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subcategory } from '../../../../model/Anomaly';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import Utils from '../../../../utils';

declare var jQuery: any;

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
})
export class SubcategoryComponent implements OnChanges {

  @Input() subcategories: Subcategory[];
  @Input() subcategoriesSelected: Subcategory[];
  @Input() subcategoriesTitle: string;
  @Input() subcategoryDescription: string;
  @Input() subcategoryName: string;
  @Input() level: number;

  @ViewChild('formContent', {static: false})
  private formContent: ElementRef;

  subcategoryForm: FormGroup;
  subcategoryTitleCtrl: FormControl;
  subcategorySelected: Subcategory;

  @Output() select = new EventEmitter<Subcategory[]>();

  showErrors: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private renderer: Renderer2,
              public elementRef: ElementRef) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subcategoryName']) {
      this.initSubcategoryForm();
      setTimeout(() => {
        this.scrollToElement();
      }, 500);
    }
  }

  scrollToElement() {
    if (isPlatformBrowser(this.platformId) && !this.hasSubSubcategory() && this.level > 1) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      if (Utils.isSmallerThanDesktop(this.platformId) && rect.height < window.innerHeight) {
       this.renderer.setStyle(this.elementRef.nativeElement.children[0], 'margin-bottom', `${window.innerHeight - rect.height - 110}px`);
      }
      jQuery('html, body').animate({
        scrollTop: this.elementRef.nativeElement.offsetTop - 110
      }, 1000, 'linear');
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
    if (this.hasSubSubcategory()) {
      this.renderer.removeStyle(this.elementRef.nativeElement.children[0], 'margin-bottom');
    } else {
      const rect = this.formContent.nativeElement.getBoundingClientRect();
      const submitButtonOffset = 145;
      if (isPlatformBrowser(this.platformId) && rect.bottom + submitButtonOffset > window.innerHeight) {
        jQuery('html, body').animate({
          scrollTop: this.elementRef.nativeElement.offsetTop + rect.height + submitButtonOffset - window.innerHeight
        }, 1000, 'linear');
      }
    }
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

import {
  AfterViewInit,
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
} from '@angular/core';
import { Subcategory } from '../../../../model/Anomaly';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { mobileFooterHeight, mobileHeaderHeight, mobileMaxWidth } from '../../../../utils';

declare var jQuery: any;

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
})
export class SubcategoryComponent implements OnChanges, AfterViewInit {

  @Input() subcategories: Subcategory[];
  @Input() subcategoriesSelected: Subcategory[];
  @Input() subcategoriesTitle: string;
  @Input() subcategoryDescription: string;
  @Input() subcategoryName: string;
  @Input() level: number;

  subcategoryForm: FormGroup;
  subcategoryTitleCtrl: FormControl;
  subcategorySelected: Subcategory;

  @Output() select = new EventEmitter<Subcategory[]>();

  showErrors: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private renderer: Renderer2,
              public elementRef: ElementRef,
              private sanitizer: DomSanitizer) { }


  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToElementIfHidden();
    }, 500);
  }

  isSmallerThanPhablet() {
    return isPlatformBrowser(this.platformId) && window && window.innerWidth <= mobileMaxWidth;
  }

  scrollToElementIfHidden() {
    if (isPlatformBrowser(this.platformId) && !this.hasSubSubcategory()) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      if (rect.height < window.innerHeight - mobileHeaderHeight && rect.bottom <= jQuery( document ).height() - mobileFooterHeight) {
       this.renderer.setStyle(this.elementRef.nativeElement.children[0], 'margin-bottom', `${window.innerHeight - rect.height - mobileHeaderHeight}px`);
      }
      if (rect.top > 1) {
        jQuery('html, body').animate({
          scrollTop: this.isSmallerThanPhablet() ? this.elementRef.nativeElement.offsetTop - mobileHeaderHeight - 40 : this.elementRef.nativeElement.offsetTop
        }, 1000, 'linear');
      }
    }
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

    if (this.hasSubSubcategory()) {
      this.renderer.removeStyle(this.elementRef.nativeElement.children[0], 'margin-bottom');
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

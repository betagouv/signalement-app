import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
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
import { isPlatformBrowser } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

declare var jQuery: any;

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
  animations: [
    trigger('scrollAnimation', [
      state('show', style({
        opacity: 1
      })),
      state('hide',   style({
        opacity: 0,
      })),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in'))
    ])
  ]
})
export class SubcategoryComponent implements OnInit, OnChanges {

  @Input() subcategories: Subcategory[];
  @Input() subcategoriesSelected: Subcategory[];
  @Input() subcategoriesTitle: string;
  @Input() subcategoryDescription: string;
  @Input() subcategoryName: string;

  subcategoryForm: FormGroup;
  subcategoryTitleCtrl: FormControl;
  subcategorySelected: Subcategory;

  @Output() select = new EventEmitter<Subcategory[]>();

  showErrors: boolean;
  scrollNotificationState: string;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private renderer: Renderer2,
              public elementRef: ElementRef) { }


  ngOnInit() {
    this.scrollNotificationState = 'hide';
    setTimeout(() => {
      this.checkScrollNotification();
    }, 2000);


    setTimeout(() => {
      const allTitles: Array<HTMLElement> = Array.from(document.querySelectorAll('.problemTitle'));
      const lastTitle = allTitles[allTitles.length - 1];

      if (lastTitle) {
        lastTitle.focus();
        lastTitle.blur();
      }

    });

  }

  @HostListener('window:scroll', ['$event'])
  checkScrollNotification() {
    if (isPlatformBrowser(this.platformId) && !this.hasSubSubcategory()) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      if (rect.top > 1 && rect.bottom >= (window.innerHeight || document.documentElement.clientHeight)) {
        this.scrollNotificationState = 'show';
      } else {
        this.scrollNotificationState = 'hide';
      }
    }
  }

  scrollToElement() {
    jQuery('html, body').animate({
      scrollTop: this.elementRef.nativeElement.offsetTop
    }, 1000);

    this.scrollNotificationState = 'hide';
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryComponent } from './subcategory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subcategory } from '../../../model/Anomaly';
import { deserialize } from 'json-typescript-mapper';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { CollapsableTextComponent } from '../../../components/collapsable-text/collapsable-text.component';

describe('SubcategoryComponent', () => {
  let component: SubcategoryComponent;
  let fixture: ComponentFixture<SubcategoryComponent>;

  const subcategoriesFixture = [
    deserialize(Subcategory, { title: 'title1', description: 'description1' }),
    deserialize(Subcategory, { title: 'title2', description: 'description2' }),
    deserialize(Subcategory, { title: 'title3', description: 'description3' }),
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubcategoryComponent,
        CollapsableTextComponent,
        TruncatePipe,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit function', () => {

    it('should initially display the form with subcategories as radio buttons list and no errors message', () => {
      component.anomalySubcategories = subcategoriesFixture;

      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(nativeElement.querySelectorAll('input[type="radio"]').length).toEqual(subcategoriesFixture.length);
      expect(nativeElement.querySelector('.notification.error')).toBeNull();
    });

    it('should define all form controls', () => {
      component.ngOnInit();

      expect(component.subcategoryForm.controls['anomalySubcategory']).toEqual(component.anomalySubcategoryCtrl);
    });

  });

  describe('submitSubcategoryForm function', () => {

    it('should display errors when occurs', () => {
      component.anomalySubcategoryCtrl.setValue('');

      component.submitSubcategoryForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it('should emit and event with a subcategory when no errors', (done) => {
      component.anomalySubcategories = subcategoriesFixture;
      component.anomalySubcategoryCtrl.setValue('title2');

      const subcategoryExpected = new Subcategory();
      subcategoryExpected.title = 'title2';
      subcategoryExpected.description = 'description2';

      component.validate.subscribe(result => {
        expect(result).toEqual(subcategoryExpected);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();
    });
  });
});

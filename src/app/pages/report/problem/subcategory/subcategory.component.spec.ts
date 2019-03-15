import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryComponent } from './subcategory.component';
import { Subcategory } from '../../../../model/Anomaly';
import { deserialize } from 'json-typescript-mapper';
import { CollapsableTextComponent } from '../../../../components/collapsable-text/collapsable-text.component';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { RouterTestingModule } from '@angular/router/testing';

describe('SubcategoryComponent', () => {

  let component: SubcategoryComponent;
  let fixture: ComponentFixture<SubcategoryComponent>;

  const subcategoriesFixture = [
    deserialize(Subcategory, { title: 'title1', description: 'description1' }),
    deserialize(Subcategory, { title: 'title2', description: 'description2' }),
    deserialize(Subcategory, {
      title: 'title3',
      description: 'description3',
      subcategories: [
        deserialize(Subcategory, { title: 'title31', description: 'description31' }),
        deserialize(Subcategory, { title: 'title32', description: 'description32' })
      ]
    }),
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubcategoryComponent,
        CollapsableTextComponent,
        TruncatePipe
      ],
      imports: [
        RouterTestingModule,
        Angulartics2RouterlessModule.forRoot(),
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

  describe('on init', () => {

    it('should display all subcategories as radio buttons list', () => {
      component.subcategories = subcategoriesFixture;
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('input[type="radio"]').length).toEqual(subcategoriesFixture.length);
    });

  });

  describe('on select ubcategory', () => {

    it('should emit an output with the selected subcategory when it contains no subcategories', (done) => {
      component.subcategories = subcategoriesFixture;
      component.ngOnInit();
      fixture.detectChanges();

      component.select.subscribe(subcategory => {
        expect(subcategory).toEqual(subcategoriesFixture[0]);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelectorAll('input[type="radio"]')[0].click();
      fixture.detectChanges();
    });

    it('should display the subcategories of the selected one when there are some', () => {
      component.subcategories = subcategoriesFixture;
      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelectorAll('input[type="radio"]')[2].click();
      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('input[type="radio"]').length)
        .toEqual(subcategoriesFixture.length + subcategoriesFixture[2].subcategories.length);
    });

  });

});

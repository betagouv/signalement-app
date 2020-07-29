import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryComponent } from './subcategory.component';
import { Subcategory } from '../../../../model/Anomaly';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from '../../../../components/components.module';
import { PipesModule } from '../../../../pipes/pipes.module';

describe('SubcategoryComponent', () => {

  let component: SubcategoryComponent;
  let fixture: ComponentFixture<SubcategoryComponent>;

  const subcategoriesFixture = [
    Object.assign(new Subcategory(), { title: 'title1', description: 'description1' }),
    Object.assign(new Subcategory(), { title: 'title2', description: 'description2' }),
    Object.assign(new Subcategory(), {
      title: 'title3',
      description: 'description3',
      subcategories: [
        Object.assign(new Subcategory(), { title: 'title31', description: 'description31' }),
        Object.assign(new Subcategory(), { title: 'title32', description: 'description32' })
      ]
    }),
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubcategoryComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        Angulartics2RouterlessModule.forRoot(),
        NoopAnimationsModule,
        ComponentsModule,
        PipesModule,
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
      component.subcategoryName = '';
      component.ngOnChanges({
        subcategoryName: new SimpleChange(null, component.subcategoryName, true)
      });
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('input[type="radio"]').length).toEqual(subcategoriesFixture.length);
    });

  });

  describe('on select subcategory', () => {

    it('should display the subcategories of the selected one when there are some', () => {
      component.subcategories = subcategoriesFixture;
      component.subcategoryName = '';
      component.ngOnChanges({
        subcategoryName: new SimpleChange(null, component.subcategoryName, true)
      });
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelectorAll('input[type="radio"]')[2].click();
      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('input[type="radio"]').length)
        .toEqual(subcategoriesFixture.length + subcategoriesFixture[2].subcategories.length);
    });

  });

  describe('on submit subcategory form', () => {

    it('should emit an array output with the selected subcategory', (done) => {
      component.subcategories = subcategoriesFixture[2].subcategories;
      component.subcategoryName = '';
      component.ngOnChanges({
        subcategoryName: new SimpleChange(null, component.subcategoryName, true)
      });
      fixture.detectChanges();

      component.select.subscribe(subcategories => {
        expect(subcategories).toEqual([subcategoriesFixture[2].subcategories[0]]);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelectorAll('input[type="radio"]')[0].click();
      fixture.detectChanges();
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();
    });

  });

  describe('on receive subsubcategories', () => {

    it('should emit an array output with subsubcategories and the selected subcategory', (done) => {
      component.select.subscribe(subcategories => {
        expect(subcategories).toEqual([subcategoriesFixture[2], subcategoriesFixture[2][1]]);
        done();
      });

      component.subcategories = subcategoriesFixture;
      component.subcategoryName = '';
      component.ngOnChanges({
        subcategoryName: new SimpleChange(null, component.subcategoryName, true)
      });
      component.subcategoryTitleCtrl.setValue(subcategoriesFixture[2].title);
      component.onSelectSubSubcategories([subcategoriesFixture[2][1]]);
    });

  });

});

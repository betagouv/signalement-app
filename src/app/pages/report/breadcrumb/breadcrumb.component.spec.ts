import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbComponent } from './breadcrumb.component';
import { Report, Step } from '../../../model/Report';
import { PrecedeByPipe } from '../../../pipes/precede-by.pipe';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AbTestsService } from 'angular-ab-tests';
import { MockAbTestsService } from '../../../../test';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbComponent,
        PrecedeByPipe,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AbTestsService, useClass: MockAbTestsService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    component.step = Step.Category;
    component.report = new Report();
    component.report.category = 'categorie';
    component.report.subcategories = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

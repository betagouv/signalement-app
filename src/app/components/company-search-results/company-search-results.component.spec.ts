import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySearchResultsComponent } from './company-search-results.component';

describe('SearchResultsComponent', () => {
  let component: CompanySearchResultsComponent;
  let fixture: ComponentFixture<CompanySearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

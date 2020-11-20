import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySearchResultsComponent } from './company-search-results.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('SearchResultsComponent', () => {
  let component: CompanySearchResultsComponent;
  let fixture: ComponentFixture<CompanySearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySearchResultsComponent ],
      imports: [
        CommonModule,
        FormsModule,
      ],
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

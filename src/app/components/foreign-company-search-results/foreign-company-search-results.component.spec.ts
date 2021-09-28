import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignCompanySearchResultsComponent } from './foreign-company-search-results.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ForeignCountrySearchResultsComponent', () => {
  let component: ForeignCompanySearchResultsComponent;
  let fixture: ComponentFixture<ForeignCompanySearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForeignCompanySearchResultsComponent ],
      imports: [
        CommonModule,
        FormsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignCompanySearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

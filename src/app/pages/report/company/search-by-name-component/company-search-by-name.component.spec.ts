import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CompanySearchByNameComponent } from './company-search-by-name.component';
import { SearchCompanyService } from '../../../../services/company.service';
import { AnalyticsService } from '../../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../../test/mocks';
import { genCompanySearchResult } from '../../../../../../test/fixtures.spec';
import { CompanySearchResultsComponent } from '../../../../components/company-search-results/company-search-results.component';

describe('CompanySearchByNameComponent', () => {

  let component: CompanySearchByNameComponent;
  let fixture: ComponentFixture<CompanySearchByNameComponent>;
  let companyService: SearchCompanyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanySearchByNameComponent,
        CompanySearchResultsComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers: [
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    companyService = TestBed.inject(SearchCompanyService);
    fixture = TestBed.createComponent(CompanySearchByNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('search companies by name and postal code', () => {

    beforeEach(() => {
      component.searchCtrl.setValue('Mon entreprise dans ma ville');
      component.searchPostalCodeCtrl.setValue('87270');
      fixture.detectChanges();
    });

    it('should ', () => {
      component.companySearchResults = [genCompanySearchResult(), genCompanySearchResult()];
      const newCompanySearchResults = [genCompanySearchResult()];
      spyOn(companyService, 'list').and.returnValue(of(newCompanySearchResults));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitSearchForm').click();
      fixture.detectChanges();

      expect(component.companySearchResults).toEqual(newCompanySearchResults);
    });

    it('should erase previous results and display the company list when results have been found', () => {
      component.companySearchResults = [genCompanySearchResult(), genCompanySearchResult()];
      const newCompanySearchResults = [genCompanySearchResult()];
      spyOn(companyService, 'list').and.returnValue(of(newCompanySearchResults));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitSearchForm').click();
      fixture.detectChanges();

      expect(component.companySearchResults).toEqual(newCompanySearchResults);
      expect(nativeElement.querySelectorAll('input[type="radio"][name="companySiret"]').length).toBe(newCompanySearchResults.length);

    });
  });

});


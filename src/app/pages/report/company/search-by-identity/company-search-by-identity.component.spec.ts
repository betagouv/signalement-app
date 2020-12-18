import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CompanySearchByIdentityComponent } from './company-search-by-identity.component';
import { CompanyService } from '../../../../services/company.service';
import { AnalyticsService } from '../../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../../test/mocks';
import { genCompanySearchResult, genSiret } from '../../../../../../test/fixtures.spec';
import { CompanySearchResultsComponent } from '../../../../components/company-search-results/company-search-results.component';

describe('CompanySearchByIdentityComponent', () => {

  let component: CompanySearchByIdentityComponent;
  let fixture: ComponentFixture<CompanySearchByIdentityComponent>;
  let companyService: CompanyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanySearchByIdentityComponent,
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
    companyService = TestBed.inject(CompanyService);
    fixture = TestBed.createComponent(CompanySearchByIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('search companies by idenity', () => {

    it('should display errors when occurs', () => {

      const nativeElement = fixture.nativeElement;
      component.identityCtrl.setValue(undefined);
      nativeElement.querySelector('button#submitSiretForm').click();
      fixture.detectChanges();

      expect(component.showErrorsByIdentity).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it('should display the company found by siret when existed', () => {

      const companyBySiret = genCompanySearchResult();
      spyOn(companyService, 'searchCompaniesByIdentity').and.returnValue(of([companyBySiret]));

      const nativeElement = fixture.nativeElement;
      component.identityCtrl.setValue(genSiret());
      nativeElement.querySelector('button#submitSiretForm').click();
      fixture.detectChanges();

      expect(component.companySearchByIdentityResults).toEqual([companyBySiret]);
      expect(nativeElement.querySelectorAll('input[type="radio"][name="companySiret"]').length).toBe(1);

    });

  });

});


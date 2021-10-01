import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyComponent, IdentificationKinds } from './company.component';
import {SearchCompanyByURLService, SearchForeignCompanyByURLService} from '../../../services/company.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportPaths } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { genCompanySearchResult, genDraftReport, genSubcategory } from '../../../../../test/fixtures.spec';
import { CompanyKinds } from '../../../model/Anomaly';
import { DraftReport, Step } from '../../../model/Report';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';
import { ComponentsModule } from '../../../components/components.module';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CompanyForeignCountryComponent } from './foreign-country/company-foreign-country.component';
import { CompanySearchByNameComponent } from './search-by-name-component/company-search-by-name.component';
import { CompanySearchByIdentityComponent } from './search-by-identity/company-search-by-identity.component';
import { CompanySearchByWebsiteComponent } from './search-by-website/company-search-by-website.component';
import { ConstantService } from '../../../services/constant.service';
import { CompanyPhoneComponent } from './phone/company-phone.component';
import { CompanyLocationComponent } from './location/company-location.component';

describe('CompanyComponent', () => {

  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let companyService: SearchCompanyByURLService;
  let searchForeignCompanyService: SearchForeignCompanyByURLService;
  let reportStorageService: ReportStorageService;
  let constantService: ConstantService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyComponent,
        BreadcrumbComponent,
        CompanyForeignCountryComponent,
        CompanySearchByNameComponent,
        CompanySearchByIdentityComponent,
        CompanySearchByWebsiteComponent,
        CompanyPhoneComponent,
        CompanyLocationComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: ReportPaths.Consumer, redirectTo: '' }]),
        NgxLoadingModule,
        ComponentsModule,
        TypeaheadModule.forRoot(),
      ],
      providers: [
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    companyService = TestBed.inject(SearchCompanyByURLService);
    reportStorageService = TestBed.inject(ReportStorageService);
    searchForeignCompanyService = TestBed.inject(SearchForeignCompanyByURLService);
    constantService = TestBed.inject(ConstantService);
  });

  describe('case of searching company with SIRET', () => {

    beforeEach(() => {
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(genDraftReport(Step.Details)));

      fixture = TestBed.createComponent(CompanyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display radios for identification choice', () => {

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('form').length).toBe(1);
      expect(nativeElement.querySelectorAll('input[type="radio"][name="identificationKind"]').length).toBe(2);
    });

    it('should enable to display the search form for identification by name', () => {
      const nativeElement = fixture.nativeElement;
      component.identificationKind = IdentificationKinds.Name;
      fixture.detectChanges();

      expect(nativeElement.querySelector('form#searchForm')).not.toBeNull();
      expect(nativeElement.querySelector('form#searchByIdentityForm')).toBeNull();
    });

    it('should enable to display the form for identification by identity', () => {
      const nativeElement = fixture.nativeElement;
      component.identificationKind = IdentificationKinds.Identity;
      fixture.detectChanges();

      expect(nativeElement.querySelector('form#searchForm')).toBeNull();
      expect(nativeElement.querySelector('form#searchByIdentityForm')).not.toBeNull();
    });


  });

  describe('case of searching company with WEBSITE', () => {

    beforeEach(() => {
      const draftReportInProgress = Object.assign(genDraftReport(Step.Details), {
        subcategories: [Object.assign(genSubcategory(), { companyKind: CompanyKinds.WEBSITE })]
      });
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));
      fixture = TestBed.createComponent(CompanyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize website form with a single input and display it', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form#websiteForm')).not.toBeNull();
      expect(nativeElement.querySelectorAll('input[type="url"][name="url"]').length).not.toBeNull();
      expect(nativeElement.querySelector('form#searchForm')).toBeNull();
      expect(nativeElement.querySelector('form#searchBySiretForm')).toBeNull();

    });

    it('should display radios for identification choice when no company found', () => {

      spyOn(companyService, 'list').and.returnValue(of([]));
      spyOn(searchForeignCompanyService, 'list').and.returnValue(of([]));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('form#websiteForm #urlInput').value = 'http://monsite.com';
      nativeElement.querySelector('form#websiteForm #urlInput').dispatchEvent(new Event('input'));
      nativeElement.querySelectorAll('form#websiteForm button')[0].click();
      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('input[type="radio"][name="identificationKind"]').length).toBe(3);
    });

    it('should display results when company found', () => {

      const companySearchResults = [genCompanySearchResult(), genCompanySearchResult()];
      spyOn(companyService, 'list').and.returnValue(of(companySearchResults));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('form#websiteForm #urlInput').value = 'http://monsite.com';
      nativeElement.querySelector('form#websiteForm #urlInput').dispatchEvent(new Event('input'));
      nativeElement.querySelectorAll('form#websiteForm button')[0].click();
      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('input[type="radio"][name="companySiret"]').length).toBe(companySearchResults.length);
    });

    describe('user unavailable to identify company', () => {

      it('should ask the user whether the company is abroad or not', () => {

        spyOn(companyService, 'list').and.returnValue(of([]));
        spyOn(searchForeignCompanyService, 'list').and.returnValue(of([]));
        spyOn(constantService, 'getCountries').and.returnValue(of([{'code': 'AFG', 'name': 'Afghanistan', 'european': false, 'transfer': false}]));

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('form#websiteForm #urlInput').value = 'http://monsite.com';
        nativeElement.querySelector('form#websiteForm #urlInput').dispatchEvent(new Event('input'));
        nativeElement.querySelectorAll('form#websiteForm button')[0].click();
        fixture.detectChanges();

        component.identificationKind = IdentificationKinds.None;
        fixture.detectChanges();

        expect(nativeElement.querySelectorAll('input[type="radio"][name="isForeignCompany"]').length).toBe(3);

      });

    });

  });

  describe('case of company with PHONE', () => {

    beforeEach(() => {
      const draftReportInProgress = Object.assign(genDraftReport(Step.Details), {
        subcategories: [Object.assign(genSubcategory(), { companyKind: CompanyKinds.PHONE })]
      });
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));
      fixture = TestBed.createComponent(CompanyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize phone form with a single input and display it', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form#phoneForm')).not.toBeNull();
      expect(nativeElement.querySelectorAll('input[type="tel"][name="phone"]').length).not.toBeNull();
      expect(nativeElement.querySelector('form#searchForm')).toBeNull();
      expect(nativeElement.querySelector('form#searchBySiretForm')).toBeNull();

    });

    it('should display radios for identification when phone is submitting', () => {

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('form#phoneForm #phoneInput').value = '0555555555';
      nativeElement.querySelector('form#phoneForm #phoneInput').dispatchEvent(new Event('input'));
      fixture.detectChanges();
      nativeElement.querySelectorAll('form#phoneForm button')[0].click();
      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('input[type="radio"][name="identificationKind"]').length).toBe(3);
    });

  });

  describe('case of company with LOCATION', () => {

    beforeEach(() => {
      const draftReportInProgress = Object.assign(genDraftReport(Step.Details), {
        subcategories: [Object.assign(genSubcategory(), { companyKind: CompanyKinds.LOCATION })]
      });
      spyOn(reportStorageService, 'retrieveReportInProgress').and.returnValue(of(Object.assign(new DraftReport(), draftReportInProgress)));

      fixture = TestBed.createComponent(CompanyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display radios for identification choice', () => {

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('form').length).toBe(1);
      expect(nativeElement.querySelectorAll('input[type="radio"][name="identificationKind"]').length).toBe(3);
    });

    it('should enable to display the search form for identification by name', () => {
      const nativeElement = fixture.nativeElement;
      component.identificationKind = IdentificationKinds.Name;
      fixture.detectChanges();

      expect(nativeElement.querySelector('form#searchForm')).not.toBeNull();
      expect(nativeElement.querySelector('form#searchByIdentityForm')).toBeNull();
    });

    it('should enable to display the form for identification by identity', () => {
      const nativeElement = fixture.nativeElement;
      component.identificationKind = IdentificationKinds.Identity;
      fixture.detectChanges();

      expect(nativeElement.querySelector('form#searchForm')).toBeNull();
      expect(nativeElement.querySelector('form#searchByIdentityForm')).not.toBeNull();
    });

    it('should enable to display the form for identification by location', () => {
      const nativeElement = fixture.nativeElement;
      component.identificationKind = IdentificationKinds.None;
      fixture.detectChanges();

      expect(nativeElement.querySelector('form#searchForm')).toBeNull();
      expect(nativeElement.querySelector('form#locationForm')).not.toBeNull();
    });


  });
});


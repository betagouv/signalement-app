import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyComponent, IdentificationKinds } from './company.component';
import { CompanyService } from '../../../services/company.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2CompleterModule } from 'ng2-completer';
import { NgxLoadingModule } from 'ngx-loading';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportPaths } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { genCompanySearchResult, genDraftReport, genSiret, genSubcategory } from '../../../../../test/fixtures.spec';
import { CompanyKinds } from '../../../model/Anomaly';
import { DraftReport, Step } from '../../../model/Report';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';
import { ComponentsModule } from '../../../components/components.module';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ForeignFormComponent } from './forms/foreign-form.component';

describe('CompanyComponent', () => {

  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let companyService: CompanyService;
  let reportStorageService: ReportStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyComponent,
        BreadcrumbComponent,
        ForeignFormComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: ReportPaths.Consumer, redirectTo: '' }]),
        Ng2CompleterModule,
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
    companyService = TestBed.inject(CompanyService);
    reportStorageService = TestBed.inject(ReportStorageService);
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

    it('should initialize forms and display radios', () => {

      const nativeElement = fixture.nativeElement;
      expect(component.searchForm).toBeDefined();
      expect(component.searchForm.controls['search']).toBeDefined();
      expect(component.searchForm.controls['searchPostalCode']).toBeDefined();
      expect(component.searchByIdentityForm).toBeDefined();
      expect(component.searchByIdentityForm.controls['identity']).toBeDefined();
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

    describe('search companies by name and postal code', () => {

      beforeEach(() => {
        component.searchCtrl.setValue('Mon entreprise dans ma ville');
        component.searchPostalCodeCtrl.setValue('87270');
        component.identificationKind = IdentificationKinds.Name;
        fixture.detectChanges();
      });

      it('should ', () => {
        component.companySearchResults = [genCompanySearchResult(), genCompanySearchResult()];
        const newCompanySearchResults = [genCompanySearchResult()];
        spyOn(companyService, 'searchCompanies').and.returnValue(of(newCompanySearchResults));

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('button#submitSearchForm').click();
        fixture.detectChanges();

        expect(component.companySearchResults).toEqual(newCompanySearchResults);
      });

      it('should erase previous results and display the company list when results have been found', () => {
        component.companySearchResults = [genCompanySearchResult(), genCompanySearchResult()];
        const newCompanySearchResults = [genCompanySearchResult()];
        spyOn(companyService, 'searchCompanies').and.returnValue(of(newCompanySearchResults));

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('button#submitSearchForm').click();
        fixture.detectChanges();

        expect(component.companySearchResults).toEqual(newCompanySearchResults);
        expect(nativeElement.querySelectorAll('input[type="radio"][name="companySiret"]').length).toBe(newCompanySearchResults.length);

      });
    });

    describe('search companies by siret', () => {

      it('should display errors when occurs', () => {
        component.identificationKind = IdentificationKinds.Identity;
        fixture.detectChanges();

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

        component.identificationKind = IdentificationKinds.Identity;
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        component.identityCtrl.setValue(genSiret());
        nativeElement.querySelector('button#submitSiretForm').click();
        fixture.detectChanges();

        expect(component.companySearchByIdentityResults).toEqual([companyBySiret]);
        expect(nativeElement.querySelectorAll('input[type="radio"][name="companySiret"]').length).toBe(1);

      });

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
      expect(component.websiteForm).toBeDefined();
      expect(component.searchForm).not.toBeDefined();
      expect(component.searchByIdentityForm).not.toBeDefined();
      expect(component.websiteForm.controls['url']).toBeDefined();
      expect(nativeElement.querySelector('form#websiteForm')).not.toBeNull();
      expect(nativeElement.querySelector('form#searchForm')).toBeNull();
      expect(nativeElement.querySelector('form#searchBySiretForm')).toBeNull();
    });

    it('should initialize others forms and display radios for identification choice when no company found', () => {

      spyOn(companyService, 'searchCompaniesByUrl').and.returnValue(of([]));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('form#websiteForm #urlInput').value = 'http://monsite.com';
      nativeElement.querySelector('form#websiteForm #urlInput').dispatchEvent(new Event('input'));
      nativeElement.querySelectorAll('form#websiteForm button')[0].click();
      fixture.detectChanges();

      expect(component.urlCtrl.value).toBe('http://monsite.com');
      expect(component.searchForm).toBeDefined();
      expect(component.searchForm.controls['search']).toBeDefined();
      expect(component.searchForm.controls['searchPostalCode']).toBeDefined();
      expect(component.searchByIdentityForm).toBeDefined();
      expect(component.searchByIdentityForm.controls['identity']).toBeDefined();
      expect(nativeElement.querySelectorAll('input[type="radio"][name="identificationKind"]').length).toBe(3);
    });

    it('should display results when company found', () => {

      const companySearchResults = [genCompanySearchResult(), genCompanySearchResult()];
      spyOn(companyService, 'searchCompaniesByUrl').and.returnValue(of(companySearchResults));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('form#websiteForm #urlInput').value = 'http://monsite.com';
      nativeElement.querySelector('form#websiteForm #urlInput').dispatchEvent(new Event('input'));
      nativeElement.querySelectorAll('form#websiteForm button')[0].click();
      fixture.detectChanges();

      expect(component.urlCtrl.value).toBe('http://monsite.com');
      expect(component.searchForm).toBeUndefined();
      expect(component.searchByIdentityForm).toBeUndefined();
      expect(component.companySearchByUrlResults).toEqual(companySearchResults);
      expect(nativeElement.querySelectorAll('input[type="radio"][name="companySiret"]').length).toBe(companySearchResults.length);
    });

    describe('user unavailable to identify company', () => {

      it('should ask the user whether the company is abroad or not', () => {

        spyOn(companyService, 'searchCompaniesByUrl').and.returnValue(of([]));

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('form#websiteForm #urlInput').value = 'http://monsite.com';
        nativeElement.querySelector('form#websiteForm #urlInput').dispatchEvent(new Event('input'));
        nativeElement.querySelectorAll('form#websiteForm button')[0].click();
        fixture.detectChanges();

        component.identificationKind = IdentificationKinds.None;
        fixture.detectChanges();

        expect(nativeElement.querySelectorAll('input[type="radio"][name="isForeignCompany"]').length).toBe(2);

      });

    });

  });
});

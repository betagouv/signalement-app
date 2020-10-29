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
import { AbTestsModule } from 'angular-ab-tests';
import { CompanyAPITestingScope, CompanyTestingVersions } from '../../../utils';
import { AnalyticsService } from '../../../services/analytics.service';
import { MockAnalyticsService } from '../../../../../test/mocks';
import { CompanySearchResult } from '../../../model/Company';

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
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: ReportPaths.Consumer, redirectTo: '' }]),
        Ng2CompleterModule,
        NgxLoadingModule,
        AbTestsModule.forRoot(
          [
            {
              versions: [ CompanyTestingVersions.SignalConsoAPI, CompanyTestingVersions.EntrepriseAPI ],
              scope: CompanyAPITestingScope,
              weights: { [CompanyTestingVersions.SignalConsoAPI]: 99, [CompanyTestingVersions.EntrepriseAPI]: 0 }
            }
          ]
        ),
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
      expect(component.searchBySiretForm).toBeDefined();
      expect(component.searchBySiretForm.controls['siret']).toBeDefined();
      expect(nativeElement.querySelectorAll('input[type="radio"][name="identificationKind"]').length).toBe(2);
    });

    it('should enable to display the search form for identication by name', () => {
      const nativeElement = fixture.nativeElement;
      component.identificationKind = IdentificationKinds.Name;
      fixture.detectChanges();

      expect(nativeElement.querySelector('form#searchForm')).not.toBeNull();
      expect(nativeElement.querySelector('form#searchBySiretForm')).toBeNull();
    });

    it('should enable to display the searchBySiret form for identification by siret', () => {
      const nativeElement = fixture.nativeElement;
      component.identificationKind = IdentificationKinds.Siret;
      fixture.detectChanges();

      expect(nativeElement.querySelector('form#searchForm')).toBeNull();
      expect(nativeElement.querySelector('form#searchBySiretForm')).not.toBeNull();
    });

    describe('search companies', () => {

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

    describe('search by siret', () => {

      it('should display errors when occurs', () => {
        component.identificationKind = IdentificationKinds.Siret;
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        component.siretCtrl.setValue('123');
        nativeElement.querySelector('button#submitSiretForm').click();
        fixture.detectChanges();

        expect(component.showErrorsBySiret).toBeTruthy();
        expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
      });

      it('should display the company found by siret when existed', () => {

        const companyBySiret = genCompanySearchResult();
        spyOn(companyService, 'searchCompaniesBySiret').and.returnValue(of(companyBySiret));

        component.identificationKind = IdentificationKinds.Siret;
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        component.siretCtrl.setValue(genSiret());
        nativeElement.querySelector('button#submitSiretForm').click();
        fixture.detectChanges();

        expect(component.companySearchBySiretResult).toEqual(companyBySiret);
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
      expect(component.searchBySiretForm).not.toBeDefined();
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
      expect(component.searchBySiretForm).toBeDefined();
      expect(component.searchBySiretForm.controls['siret']).toBeDefined();
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
      expect(component.searchBySiretForm).toBeUndefined();
      expect(component.companySearchByUrlResults).toEqual(companySearchResults);
      expect(nativeElement.querySelectorAll('input[type="radio"][name="companySiret"]').length).toBe(companySearchResults.length);
    });

  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyComponent } from './company.component';
import { CompanyService } from '../../../services/company.service';
import { CompanySearchResult, CompanySearchResults } from '../../../model/CompanySearchResult';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2CompleterModule } from 'ng2-completer';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { NgxLoadingModule } from 'ngx-loading';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportPaths } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { AutofocusDirective } from '../../../directives/auto-focus.directive';
import { genDraftReport, genSubcategory } from '../../../../../test/fixtures.spec';
import { CompanyKinds } from '../../../model/Anomaly';

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
        AutofocusDirective,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: ReportPaths.Consumer, redirectTo: '' }]),
        Ng2CompleterModule,
        NgxLoadingModule,
        Angulartics2RouterlessModule.forRoot(),
      ],
      providers: []
    })
      .overrideTemplate(BreadcrumbComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    companyService = TestBed.get(CompanyService);
    reportStorageService = TestBed.get(ReportStorageService);
  });

  describe('case of searching company with SIRET', () => {

    beforeEach(() => {
      reportStorageService.reportInProgess = of(Object.assign(genDraftReport(), {draftCompany: undefined}));

      fixture = TestBed.createComponent(CompanyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize forms and display the search form', () => {

      const nativeElement = fixture.nativeElement;
      expect(component.searchForm).toBeDefined();
      expect(component.searchForm.controls['search']).toBeDefined();
      expect(component.searchForm.controls['searchPostalCode']).toBeDefined();
      expect(component.searchBySiretForm).toBeDefined();
      expect(component.searchBySiretForm.controls['siret']).toBeDefined();
      expect(nativeElement.querySelector('form#searchForm')).not.toBeNull();
      expect(nativeElement.querySelector('form#searchBySiretForm')).toBeNull();
    });

    it('should enable to display the searchBySiret form whith navTabs', () => {
      const nativeElement = fixture.nativeElement;
      nativeElement.querySelectorAll('.nav-item')[1].click();
      fixture.detectChanges();

      expect(nativeElement.querySelector('form#searchForm')).toBeNull();
      expect(nativeElement.querySelector('form#searchBySiretForm')).not.toBeNull();
    });

    describe('search companies', () => {

      beforeEach(() => {
        component.searchCtrl.setValue('Mon entreprise dans ma ville');
        component.searchPostalCodeCtrl.setValue('87270');
      });

      it('should initialize previous results', () => {
        component.companySearchResults = [Object.assign(new CompanySearchResult(), { name: 'C1' }), Object.assign(new CompanySearchResult(), { name: 'C2' })];
        const companySearchResults = Object.assign(new CompanySearchResults(), {
          total_results: 0,
          etablissement: []
        });
        spyOn(companyService, 'searchCompanies').and.returnValue(of(companySearchResults));

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('button#submitSearchForm').click();
        fixture.detectChanges();

        expect(component.companySearchResults).toEqual([]);
      });

      it('should display the company list when only one result has been found', () => {

        const companySearchResults = Object.assign(new CompanySearchResults(), {
          total_results: 1,
          etablissement: [{
            l1_normalisee: 'CASINO CARBURANTS',
            l2_normalisee: null,
            l3_normalisee: null,
            l4_normalisee: 'AVENUE DE LIMOGES',
            l5_normalisee: null,
            l6_normalisee: '87270 COUZEIX',
            l7_normalisee: 'FRANCE',
            enseigne: null,
            nom_raison_sociale: 'CASINO CARBURANTS',
            code_postal: '87270'
          }]
        });
        spyOn(companyService, 'searchCompanies').and.returnValue(of(companySearchResults));

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('button#submitSearchForm').click();
        fixture.detectChanges();

        expect(component.companySearchResults).toEqual(companySearchResults.companies);

      });

      it('should display the company list when many results have been found', () => {

        const companySearchResults = Object.assign(new CompanySearchResults(), {
          total_results: 2,
          etablissement: [
            {
              l1_normalisee: 'CASINO CARBURANTS',
              l2_normalisee: null,
              l3_normalisee: null,
              l4_normalisee: 'AVENUE DE LIMOGES',
              l5_normalisee: null,
              l6_normalisee: '87270 COUZEIX',
              l7_normalisee: 'FRANCE',
              enseigne: null,
              nom_raison_sociale: 'CASINO CARBURANTS',
            },
            {
              l1_normalisee: 'DISTRIBUTION CASINO FRANCE',
              l2_normalisee: null,
              l3_normalisee: null,
              l4_normalisee: '1 RUE DU DOCTEUR ROBERT PASCAUD',
              l5_normalisee: null,
              l6_normalisee: '87270 COUZEIX',
              l7_normalisee: 'FRANCE',
              enseigne: null,
              nom_raison_sociale: 'DISTRIBUTION CASINO FRANCE',
            }]
        });
        spyOn(companyService, 'searchCompanies').and.returnValue(of(companySearchResults));

        const nativeElement = fixture.nativeElement;
        nativeElement.querySelector('button#submitSearchForm').click();
        fixture.detectChanges();

        expect(component.companySearchResults).toEqual(companySearchResults.companies);
      });

    });

    describe('submitting siret form', () => {

      it('should display errors when occurs', () => {
        component.bySiret = true;
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        component.siretCtrl.setValue('123');
        nativeElement.querySelector('button#submitSiretForm').click();
        fixture.detectChanges();

        expect(component.showErrorsBySiret).toBeTruthy();
        expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
      });

      it('should display the company found by siret when existed', () => {

        const companyBySiret = Object.assign(
          new CompanySearchResult(),
          {
            name: 'Mon entreprise',
            line1: 'Mon entreprise',
            line2: 'Mon adresse dans ma ville',
            postalCode: '87270',
            siret: '12345678901234'
          }
        );
        spyOn(companyService, 'searchCompaniesBySiret').and.returnValue(of(companyBySiret));

        component.bySiret = true;
        fixture.detectChanges();

        const nativeElement = fixture.nativeElement;
        component.siretCtrl.setValue('12345678901234');
        nativeElement.querySelector('button#submitSiretForm').click();
        fixture.detectChanges();

        expect(component.companySearchBySiretResult).toEqual(companyBySiret);

      });

    });
  });

  describe('case of searching company with WEBSITE', () => {

    beforeEach(() => {
      reportStorageService.reportInProgess = of(Object.assign(genDraftReport(),
        {
          subcategories: [Object.assign(genSubcategory(), { companyKind: CompanyKinds.WEBSITE })],
          draftCompany: undefined
        }
       ));
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

  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyComponent } from './company.component';
import { CompanyService } from '../../../services/company.service';
import { Company, CompanySearchResult } from '../../../model/Company';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';
import { Ng2CompleterModule } from 'ng2-completer';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { NgxLoadingModule } from 'ngx-loading';
import { Report, Step } from '../../../model/Report';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportPaths } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';

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
    reportStorageService.reportInProgess = of(new Report());

    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and display a form with a search input', () => {

    const nativeElement = fixture.nativeElement;
    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.controls['search']).toBeDefined();
    expect(component.searchForm.controls['searchPostalCode']).toBeDefined();
    expect(nativeElement.querySelector('form#searchForm')).not.toBeNull();
    expect(nativeElement.querySelector('form#aroundForm')).toBeNull();
    expect(nativeElement.querySelector('form#siretForm')).toBeNull();
  });

  describe('search companies', () => {

    beforeEach(() => {
      component.searchCtrl.setValue('Mon entreprise dans ma ville');
      component.searchPostalCodeCtrl.setValue('87270');
    });

    it('should initialize previous results', () => {
      component.companies = [deserialize(Company, { name: 'C1' }), deserialize(Company, { name: 'C2' })];
      const companySearchResult = deserialize(CompanySearchResult, {
        'total_results': 0,
        'etablissement': []
      });
      spyOn(companyService, 'searchCompanies').and.returnValue(of(companySearchResult));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitSearchForm').click();
      fixture.detectChanges();

      expect(component.companies).toEqual([]);
    });

    it('should display the company list when only one result has been found', () => {

      const companySearchResult = deserialize(CompanySearchResult, {
        'total_results': 1,
        'etablissement': [{
          'l1_normalisee': 'CASINO CARBURANTS',
          'l2_normalisee': null,
          'l3_normalisee': null,
          'l4_normalisee': 'AVENUE DE LIMOGES',
          'l5_normalisee': null,
          'l6_normalisee': '87270 COUZEIX',
          'l7_normalisee': 'FRANCE',
          'enseigne': null,
          'nom_raison_sociale': 'CASINO CARBURANTS',
          'code_postal': '87270'
        }]
      });
      spyOn(companyService, 'searchCompanies').and.returnValue(of(companySearchResult));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitSearchForm').click();
      fixture.detectChanges();

      expect(component.companies).toEqual(companySearchResult.companies);

    });

    it('should display the company list when many results have been found', () => {

      const companySearchResult = deserialize(CompanySearchResult, {
        'total_results': 2,
        'etablissement': [
          {
            'l1_normalisee': 'CASINO CARBURANTS',
            'l2_normalisee': null,
            'l3_normalisee': null,
            'l4_normalisee': 'AVENUE DE LIMOGES',
            'l5_normalisee': null,
            'l6_normalisee': '87270 COUZEIX',
            'l7_normalisee': 'FRANCE',
            'enseigne': null,
            'nom_raison_sociale': 'CASINO CARBURANTS',
          },
          {
            'l1_normalisee': 'DISTRIBUTION CASINO FRANCE',
            'l2_normalisee': null,
            'l3_normalisee': null,
            'l4_normalisee': '1 RUE DU DOCTEUR ROBERT PASCAUD',
            'l5_normalisee': null,
            'l6_normalisee': '87270 COUZEIX',
            'l7_normalisee': 'FRANCE',
            'enseigne': null,
            'nom_raison_sociale': 'DISTRIBUTION CASINO FRANCE',
          }]
      });
      spyOn(companyService, 'searchCompanies').and.returnValue(of(companySearchResult));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitSearchForm').click();
      fixture.detectChanges();

      expect(component.companies).toEqual(companySearchResult.companies);
    });

    it('enable to display a form to enter manually company information', () => {
      component.searchBySiret();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form#siretForm')).not.toBeNull();
    });

  });

  describe('submitting siret form', () => {

    it('should display errors when occurs', () => {
      component.searchBySiret();
      component.siretCtrl.setValue('123');

      component.submitSiretForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it ('should change the shared report with the company found by siret', () => {

      const companyBySiret = Object.assign(
        new Company(),
        {
          name: 'Mon entreprise',
          line1: 'Mon entreprise',
          line2: 'Mon adresse dans ma ville',
          postalCode: '87270',
          siret: '12345678901234'
        }
      );
      spyOn(companyService, 'searchCompaniesBySiret').and.returnValue(of(companyBySiret));

      component.searchBySiret();
      component.siretCtrl.setValue('12345678901234');
      const changeReportSpy = spyOn(reportStorageService, 'changeReportInProgressFromStep');
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitSiretForm').click();
      fixture.detectChanges();

      const reportExpected = new Report();
      reportExpected.company = companyBySiret;

      expect(changeReportSpy).toHaveBeenCalledWith(reportExpected, Step.Company);

    });

  });
});

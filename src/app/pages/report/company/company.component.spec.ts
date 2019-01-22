import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyComponent } from './company.component';
import { CompanyService } from '../../../services/company.service';
import { Company, CompanySearchResult } from '../../../model/Company';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';
import { Ng2CompleterModule } from 'ng2-completer';
import { AddressService } from '../../../services/address.service';
import { NgxLoadingModule } from 'ngx-loading';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';

describe('CompanyFormComponent', () => {

  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;
  let companyService: CompanyService;
  let addressService: AddressService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        Ng2CompleterModule,
        NgxLoadingModule,
        Angulartics2RouterlessModule.forRoot(),
      ],
      providers: [
        CompanyService,
        AddressService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    companyService = TestBed.get(CompanyService);
    addressService = TestBed.get(AddressService);
    spyOn(addressService, 'addressData').and.returnValue(of([]));

    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and display a form with a search input', () => {
    component.ngOnInit();

    const nativeElement = fixture.nativeElement;
    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.controls['search']).toBeDefined();
    expect(nativeElement.querySelector('form#searchForm')).not.toBeNull();
    expect(nativeElement.querySelector('form#companyForm')).toBeNull();
  });

  describe('search companies', () => {

    beforeEach(() => {
      component.searchCtrl.setValue('Mon entreprise dans ma ville');
    });

    it('should initialize previous results', () => {
      component.companies = [deserialize(Company, { name: 'C1' }), deserialize(Company, { name: 'C2' })];
      const companySearchResult = deserialize(CompanySearchResult, {
        'total_results': 0,
        'etablissement': []
      });
      spyOn(companyService, 'searchCompanies').and.returnValue(of(companySearchResult));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      expect(component.companies).toEqual([]);
    });

    it('should emit and event with the company details when only one result has been found', (done) => {

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

      component.select.subscribe(company => {
        expect(company).toEqual(companySearchResult.companies[0]);
        expect(company.postalCode).toEqual('87270');
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

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
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      expect(component.companies).toEqual(companySearchResult.companies);
    });

    it('enable to display a form to enter manually company information', () => {
      component.editCompany();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form#companyForm')).not.toBeNull();
    });

  });

  describe('submitting company form', () => {

    it ('should emit and event with a company which contains form inputs', (done) => {

      const nativeElement = fixture.nativeElement;
      component.editCompany();
      component.nameCtrl.setValue('Mon entreprise');
      component.addressCtrl.setValue('Mon adresse dans ma ville');
      component.addressCtrlPostalCode = '87270';
      fixture.detectChanges();

      const companyExpected = Object.assign(
        new Company(),
        {
          name: 'Mon entreprise',
          line1: 'Mon entreprise',
          line2: 'Mon adresse dans ma ville',
          postalCode: '87270'
        }
      );
      component.select.subscribe(company => {
        expect(company).toEqual(companyExpected);
        done();
      });

      nativeElement.querySelector('button#submitCompanyForm').click();
      fixture.detectChanges();

    });

  });
});

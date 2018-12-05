import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFormComponent } from './company-form.component';
import { CompanyService, MaxCompanyResult } from '../../services/company.service';
import { Company, CompanySearchResult } from '../../model/Company';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { deserialize } from 'json-typescript-mapper';
import { HttpClientModule } from '@angular/common/http';

describe('CompanyFormComponent', () => {

  let component: CompanyFormComponent;
  let fixture: ComponentFixture<CompanyFormComponent>;
  let companyService: CompanyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyFormComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers: [
        CompanyService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    companyService = TestBed.get(CompanyService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize a form with name and city input', () => {
    component.ngOnInit();

    expect(component.companyForm.controls['name']).toBeDefined();
    expect(component.companyForm.controls['city']).toBeDefined();
  });

  describe('search a company by name and city', () => {

    beforeEach(() => {
      component.nameCtrl.setValue('Mon entreprise');
      component.cityCtrl.setValue('Ma ville');
      /*const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('input[formcontrolname="name"]').textContent = 'Mon entreprise';
      nativeElement.querySelector('input[formcontrolname="city"]').textContent = 'Ma ville';*/
    });

    it('should initialize previous results', () => {
      component.companies = [deserialize(Company, {name: 'C1'}), deserialize(Company, {name: 'C2'})];
      component.total = 2;
      const companySearchResult = deserialize(CompanySearchResult, {
        'total_results': 0,
        'etablissement': []
      });
      spyOn(companyService, 'searchByNameAndPostCode').and.returnValue(of(companySearchResult));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      expect(component.total).toBe(0);
      expect(component.companies).toEqual([]);
    });

    it ('should emit and event with the company details when only one result has been found', (done) => {

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
          'nom_raison_sociale': 'CASINO CARBURANTS'
        }]
      });
      spyOn(companyService, 'searchByNameAndPostCode').and.returnValue(of(companySearchResult));

      component.companySelected.subscribe(company => {
        expect(company).toEqual(companySearchResult.companies[0]);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

    });

    it ('should display the company list and disable the search when many results have been found', () => {

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
      spyOn(companyService, 'searchByNameAndPostCode').and.returnValue(of(companySearchResult));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      expect(component.companies).toEqual(companySearchResult.companies);
      expect(nativeElement.querySelector('button[type="submit"]')).toBeNull();
      expect(nativeElement.querySelector('input[formcontrolname="name"]').getAttribute('disabled')).not.toBeNull();
      expect(nativeElement.querySelector('input[formcontrolname="city"]').getAttribute('disabled')).not.toBeNull();
    });

    it ('display an alert message when there are too many results', () => {

      const companySearchResult = deserialize(CompanySearchResult, {
        'total_results': MaxCompanyResult + 1,
        'etablissement': []
      });
      spyOn(companyService, 'searchByNameAndPostCode').and.returnValue(of(companySearchResult));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      expect(component.companies).toEqual([]);
      expect(nativeElement.querySelector('.alert')).not.toBeNull();
    });

    it ('display an address input and disable the search when there are no result', () => {

      const companySearchResult = deserialize(CompanySearchResult, {
        'total_results': 0,
        'etablissement': []
      });
      spyOn(companyService, 'searchByNameAndPostCode').and.returnValue(of(companySearchResult));

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

      expect(component.companies).toEqual([]);
      expect(component.companyForm.controls['address']).toBeDefined();
      expect(nativeElement.querySelector('button[type="submit"]').textContent).toBe('Valider');
      expect(nativeElement.querySelector('input[formcontrolname="name"]').getAttribute('disabled')).not.toBeNull();
      expect(nativeElement.querySelector('input[formcontrolname="city"]').getAttribute('disabled')).not.toBeNull();
    });

    it ('should emit and event with a company which contains the form inputs', (done) => {

      component.companyForm.addControl('address', component.addressCtrl);
      component.addressCtrl.setValue('Mon adresse');

      const companyExpected = Object.assign(
        new Company(),
        {
          name: 'Mon entreprise',
          line1: 'Mon entreprise',
          line2: 'Mon adresse',
          line3: 'Ma ville'
        }
      );
      component.companySelected.subscribe(company => {
        expect(company).toEqual(companyExpected);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

    });

  });
});

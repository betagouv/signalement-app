import { TestBed } from '@angular/core/testing';

import { CompanyService, MaxCompanyResult } from './company.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';
import { environment } from '../../environments/environment';
import { deserialize } from 'json-typescript-mapper';
import { Company } from '../model/Company';

describe('CompanyService', () => {

  let httpMock: HttpTestingController;
  let companyService: CompanyService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      ServiceUtils,
    ]
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    companyService = TestBed.get(CompanyService);
  });

  it('should be created', () => {
    expect(companyService).toBeTruthy();
  });

  it('should map the result into a CompanySearchResult object', (done) => {

    const search = 'recherche';
    const searchPostalCode = '87270';

    companyService.searchCompanies(search, searchPostalCode).subscribe(companySearchResult => {
      expect(companySearchResult.total).toEqual(2);
      expect(companySearchResult.companies.length).toEqual(2);
      expect(companySearchResult.companies[0]).toEqual(deserialize(Company, {
        'l1_normalisee': 'CASINO CARBURANTS',
        'l2_normalisee': null,
        'l3_normalisee': null,
        'l4_normalisee': 'AVENUE DE LIMOGES',
        'l5_normalisee': null,
        'l6_normalisee': '87270 COUZEIX',
        'l7_normalisee': 'FRANCE',
        'enseigne': null,
        'nom_raison_sociale': 'CASINO CARBURANTS',
        'siren': '428267942',
        'siret': '42826794201192',
        'code_postal': '87270'
      }));
      done();
    });

    const companiesRequest = httpMock.expectOne(`${environment.apiCompanyBaseUrl}/api/sirene/v1/full_text/${search}?code_postal=${searchPostalCode}&per_page=${MaxCompanyResult}`);
    companiesRequest.flush(result);

  });

  it('should catch error with status 404 and return a CompanySearchResult object', (done) => {

    const search = 'recherche';
    const searchPostalCode = '87270';

    companyService.searchCompanies(search, searchPostalCode).subscribe(companySearchResult => {
      expect(companySearchResult.total).toEqual(0);
      done();
    });

    const companiesRequest = httpMock.expectOne(`${environment.apiCompanyBaseUrl}/api/sirene/v1/full_text/${search}?code_postal=${searchPostalCode}&per_page=${MaxCompanyResult}`);
    companiesRequest.flush({ message: 'no results found' }, {status: 404, statusText: 'not found'});
  });

  const result = {
    'total_results': 2,
    'total_pages': 1,
    'per_page': 10,
    'page': 1,
    'etablissement': [
      {
        'id': 43264194,
        'siren': '428267942',
        'siret': '42826794201192',
        'l1_normalisee': 'CASINO CARBURANTS',
        'l2_normalisee': null,
        'l3_normalisee': null,
        'l4_normalisee': 'AVENUE DE LIMOGES',
        'l5_normalisee': null,
        'l6_normalisee': '87270 COUZEIX',
        'l7_normalisee': 'FRANCE',
        'l1_declaree': 'CASINO CARBURANTS',
        'l2_declaree': null,
        'l3_declaree': null,
        'l4_declaree': 'AV DE LIMOGES',
        'l5_declaree': null,
        'l6_declaree': '87270 COUZEIX',
        'l7_declaree': null,
        'numero_voie': null,
        'indice_repetition': null,
        'type_voie': 'AV',
        'libelle_voie': 'DE LIMOGES',
        'code_postal': '87270',
        'cedex': null,
        'region': '75',
        'libelle_region': 'Nouvelle-Aquitaine',
        'departement': '87',
        'arrondissement': '2',
        'canton': '06',
        'commune': '050',
        'libelle_commune': 'COUZEIX',
        'departement_unite_urbaine': '87',
        'taille_unite_urbaine': '6',
        'numero_unite_urbaine': '01',
        'etablissement_public_cooperation_intercommunale': '248719312',
        'tranche_commune_detaillee': '22',
        'zone_emploi': '7404',
        'is_siege': '0',
        'enseigne': null,
        'nom_raison_sociale': 'CASINO CARBURANTS',
        'telephone': null,
        'longitude': '1.2385',
        'latitude': '45.870349',
        'geo_score': '0.78',
        'geo_type': 'street',
        'geo_adresse': 'Avenue de Limoges 87270 Couzeix'
      },
      {
        'id': 43264202,
        'siren': '428268023',
        'siret': '42826802326254',
        'l1_normalisee': 'DISTRIBUTION CASINO FRANCE',
        'l2_normalisee': null,
        'l3_normalisee': null,
        'l4_normalisee': '1 RUE DU DOCTEUR ROBERT PASCAUD',
        'l5_normalisee': null,
        'l6_normalisee': '87270 COUZEIX',
        'l7_normalisee': 'FRANCE',
        'l1_declaree': 'DISTRIBUTION CASINO FRANCE',
        'l2_declaree': null,
        'l3_declaree': null,
        'l4_declaree': '1 RUE DU DOCTEUR ROBERT PASCAUD',
        'l5_declaree': null,
        'l6_declaree': '87270 COUZEIX',
        'l7_declaree': null,
        'numero_voie': '1',
        'indice_repetition': null,
        'type_voie': 'RUE',
        'libelle_voie': 'DU DOCTEUR ROBERT PASCAUD',
        'code_postal': '87270',
        'cedex': null,
        'region': '75',
        'libelle_region': 'Nouvelle-Aquitaine',
        'departement': '87',
        'arrondissement': '2',
        'canton': '06',
        'commune': '050',
        'libelle_commune': 'COUZEIX',
        'departement_unite_urbaine': '87',
        'enseigne': null,
        'nom_raison_sociale': 'DISTRIBUTION CASINO FRANCE',
        'telephone': null,
        'longitude': '1.23483',
        'latitude': '45.881933',
        'geo_score': '0.86',
        'geo_type': 'street',
        'geo_adresse': 'Rue du Docteur Robert Pascaud 87270 Couzeix'
      }
    ],
    'spellcheck': null
  };
});

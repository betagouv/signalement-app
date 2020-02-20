import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Company, CompanySearchResult } from '../model/Company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map } from 'rxjs/operators';

export const MaxCompanyResult = 20;

class RawCompanyService {

  constructor(protected http: HttpClient,
    protected serviceUtils: ServiceUtils) {}

  searchCompanies(search: string, searchPostalCode: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('code_postal', searchPostalCode.toString());
    httpParams = httpParams.append('per_page', MaxCompanyResult.toString());
    return this.http.get<CompanySearchResult>(
      this.serviceUtils.getUrl(Api.Company, ['api', 'sirene', 'v1', 'full_text', search]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => Object.assign(new CompanySearchResult(), result)),
      catchError(err => {
        if (err.status === 404) {
          return of(Object.assign(new CompanySearchResult(), {
            total: 0,
            companies: []
          }));
        } else {
          return throwError(err);
        }
      })
    );
  }

  searchCompaniesBySiret(siret: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('maxCount', MaxCompanyResult.toString());
    return this.http.get<CompanySearchResult>(
      this.serviceUtils.getUrl(Api.Company, ['api', 'sirene', 'v1', 'siret', siret]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => {
        if (result['etablissement'] && result['etablissement']['code_postal']) {
          return Object.assign(new Company(), result['etablissement']);
        }
      }),
      catchError(err => {
        if (err.status === 404) {
          return of(undefined);
        } else {
          return throwError(err);
        }
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends RawCompanyService {

  constructor(protected http: HttpClient,
    protected serviceUtils: ServiceUtils) {
      super(http, serviceUtils);
    }

  private DGCCRF_DATA = {
    siret: '12002503600035',
    nom_raison_sociale: 'DIRECTION GENERALE DE LA CONCURRENCE, DE LA CONSOMMATION ET DE LA REPRESSION DES FRAUDES',
    l1_normalisee: 'DIRECTION GENERALE DE LA CONCURRENCE DE LA CONSOMMATION ET DE LA REPRESSION DES FRAUDES',
    l2_normalisee: 'TELEDOC 071',
    l3_normalisee: null,
    l4_normalisee: '59 BD VINCENT AURIOL',
    l6_normalisee: '75013 PARIS 13',
    code_postal: '75013',
    libelle_activite_principale: 'Administration publique (tutelle) des activités économiques'
  };

  private searchHooks = [
    {
      query: "orange",
      results: [
        {
          "siret": "38012986645100",
          "nom_raison_sociale": "ORANGE",
          "l1_normalisee": "ORANGE",
          "l2_normalisee": "BAT A",
          "l3_normalisee": null,
          "l4_normalisee": "1 AVENUE DU PDT NELSON MANDELA",
          "l5_normalisee": null,
          "l6_normalisee": "94110 ARCUEIL",
          "code_postal": "94110",
          "libelle_activite_principale": "Commerce de détail de matériels de télécommunication en magasin spécialisé"
        }
      ]
    },
    {
      query: "sfr",
      results: [
        {
          "siret": "34305956400959",
          "nom_raison_sociale": "SOCIETE FRANCAISE DU RADIOTELEPHONE - SFR",
          "l1_normalisee": "SOCIETE FRANCAISE DU RADIOTELEPHONE SFR",
          "l2_normalisee": "SFR",
          "l3_normalisee": null,
          "l4_normalisee": "16 RUE DU GENERAL DE BOISSIEU",
          "l5_normalisee": null,
          "l6_normalisee": "75015 PARIS 15",
          "code_postal": "75015",
          "libelle_activite_principale": "Télécommunications sans fil"
        }
      ]
    },
    {
      query: "bouygues",
      results: [
        {
          "siret": "39748093003464",
          "nom_raison_sociale": "BOUYGUES TELECOM",
          "l1_normalisee": "BOUYGUES TELECOM",
          "l2_normalisee": "13 A 15",
          "l3_normalisee": null,
          "l4_normalisee": "13 AVENUE DU MARECHAL JUIN",
          "l5_normalisee": null,
          "l6_normalisee": "92360 MEUDON",
          "code_postal": "92360",
          "libelle_activite_principale": "Autres activités informatiques"
        }
      ]
    },
    {
      query: "free",
      results: [
        {
          "siret": "49924713800021",
          "nom_raison_sociale": "FREE MOBILE",
          "l1_normalisee": "FREE MOBILE",
          "l2_normalisee": null,
          "l3_normalisee": null,
          "l4_normalisee": "16 RUE DE LA VILLE L EVEQUE",
          "l5_normalisee": null,
          "l6_normalisee": "75008 PARIS 8",
          "code_postal": "75008",
          "libelle_activite_principale": "Télécommunications sans fil"
        },
        {
          "siret": "42193886100034",
          "nom_raison_sociale": "FREE",
          "l1_normalisee": "FREE",
          "l2_normalisee": null,
          "l3_normalisee": null,
          "l4_normalisee": "8 RUE DE LA VILLE L EVEQUE",
          "l5_normalisee": null,
          "l6_normalisee": "75008 PARIS 8",
          "code_postal": "75008",
          "libelle_activite_principale": "Télécommunications filaires"
        }
      ]
    }
  ];

  searchCompanies(search: string, searchPostalCode: string) {
    let terms = search.trim().toLowerCase().split(" ");
    let match = this.searchHooks.find(hook => terms.indexOf(hook.query) != -1);
    return super.searchCompanies(search, searchPostalCode).pipe(
      map(results => {
        if (match !== undefined) {
          let matches = Object.assign(new CompanySearchResult(), {
            total: match.results.length,
            etablissement: match.results
          });
          matches.companies.forEach(c => c.highlight = true);
          results.companies = [
            ...matches.companies,
            ...results.companies.filter(c =>
              !match.results.find(r => r.siret == c.siret)
            )];
          results.total = results.companies.length;
        }
        return results;
      })
    );
  }

  searchCompaniesBySiret(siret: string) {
    if (siret === this.DGCCRF_DATA.siret)
      return of(Object.assign(new Company(), this.DGCCRF_DATA));
    else
      return super.searchCompaniesBySiret(siret);
  }
}


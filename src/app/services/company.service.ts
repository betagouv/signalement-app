import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CompanySearchResult, CompanySearchResults } from '../model/CompanySearchResult';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Company } from '../model/Company';

export const MaxCompanyResult = 20;

class RawCompanyService {

  constructor(protected http: HttpClient,
    protected serviceUtils: ServiceUtils) {}

  searchCompanies(search: string, searchPostalCode: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('code_postal', searchPostalCode.toString());
    httpParams = httpParams.append('per_page', MaxCompanyResult.toString());
    return this.http.get<CompanySearchResults>(
      this.serviceUtils.getUrl(Api.Company, ['api', 'sirene', 'v1', 'full_text', search]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => Object.assign(new CompanySearchResults(), result)),
      catchError(err => {
        if (err.status === 404) {
          return of(Object.assign(new CompanySearchResults(), {
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
    return this.http.get<CompanySearchResults>(
      this.serviceUtils.getUrl(Api.Company, ['api', 'sirene', 'v1', 'siret', siret]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => {
        if (result['etablissement'] && result['etablissement']['code_postal']) {
          return Object.assign(new CompanySearchResult(), result['etablissement']);
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

  searchRegisterCompanies(search: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('q', search);
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<Company[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'search']),
          Object.assign(headers, { params: httpParams })
        );
      })
    );
  }

  updateCompanyAddress(siret: string, address: string, postalCode: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.put<Company>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'companies', siret, 'address']),
          {
            address,
            postalCode
          },
          headers
        );
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
      query: /\borange\b/i,
      results: [
        {
          'siret': '38012986645100',
          'nom_raison_sociale': 'ORANGE',
          'l1_normalisee': 'ORANGE',
          'l2_normalisee': 'BAT A',
          'l3_normalisee': null,
          'l4_normalisee': '1 AVENUE DU PDT NELSON MANDELA',
          'l5_normalisee': null,
          'l6_normalisee': '94110 ARCUEIL',
          'code_postal': '94110',
          'libelle_activite_principale': 'Commerce de détail de matériels de télécommunication en magasin spécialisé'
        }
      ]
    },
    {
      query: /\bsfr\b/i,
      results: [
        {
          'siret': '34305956400959',
          'nom_raison_sociale': 'SOCIETE FRANCAISE DU RADIOTELEPHONE - SFR',
          'l1_normalisee': 'SOCIETE FRANCAISE DU RADIOTELEPHONE SFR',
          'l2_normalisee': 'SFR',
          'l3_normalisee': null,
          'l4_normalisee': '16 RUE DU GENERAL DE BOISSIEU',
          'l5_normalisee': null,
          'l6_normalisee': '75015 PARIS 15',
          'code_postal': '75015',
          'libelle_activite_principale': 'Télécommunications sans fil'
        }
      ]
    },
    {
      query: /\bbouygues?\b/i,
      results: [
        {
          'siret': '39748093003464',
          'nom_raison_sociale': 'BOUYGUES TELECOM',
          'l1_normalisee': 'BOUYGUES TELECOM',
          'l2_normalisee': '13 A 15',
          'l3_normalisee': null,
          'l4_normalisee': '13 AVENUE DU MARECHAL JUIN',
          'l5_normalisee': null,
          'l6_normalisee': '92360 MEUDON',
          'code_postal': '92360',
          'libelle_activite_principale': 'Autres activités informatiques'
        }
      ]
    },
    {
      query: /\bfree\b/i,
      results: [
        {
          'siret': '49924713800021',
          'nom_raison_sociale': 'FREE MOBILE',
          'l1_normalisee': 'FREE MOBILE',
          'l2_normalisee': null,
          'l3_normalisee': null,
          'l4_normalisee': '16 RUE DE LA VILLE L EVEQUE',
          'l5_normalisee': null,
          'l6_normalisee': '75008 PARIS 8',
          'code_postal': '75008',
          'libelle_activite_principale': 'Télécommunications sans fil'
        },
        {
          'siret': '42193886100034',
          'nom_raison_sociale': 'FREE',
          'l1_normalisee': 'FREE',
          'l2_normalisee': null,
          'l3_normalisee': null,
          'l4_normalisee': '8 RUE DE LA VILLE L EVEQUE',
          'l5_normalisee': null,
          'l6_normalisee': '75008 PARIS 8',
          'code_postal': '75008',
          'libelle_activite_principale': 'Télécommunications filaires'
        }
      ]
    },
    {
      query: /\beni\b/i,
      results: [
        {
          'siret': '45122569200024',
          'nom_raison_sociale': 'ENI GAS & POWER FRANCE',
          'l1_normalisee': 'ENI GAS POWER FRANCE',
          'l2_normalisee': 'ENI',
          'l3_normalisee': null,
          'l4_normalisee': '24 RUE JACQUES IBERT',
          'l5_normalisee': null,
          'l6_normalisee': '92300 LEVALLOIS-PERRET',
          'code_postal': '92300',
          'libelle_activite_principale': 'Commerce de combustibles gazeux par conduites',
          'highlight': 'Pour tout signalement relatif à ENI (abonnements énergétiques, gaz, etc.)'
        }
      ]
    },
    {
      query: /\bamazone?\b/i,
      results: [
        {
          'siret': '48777332700027',
          'nom_raison_sociale': 'AMAZON EU SARL',
          'l1_normalisee': 'AMAZON EU SARL',
          'l2_normalisee': 'AMAZON EU SARL SUCCURSALE FRANCAISE',
          'l3_normalisee': null,
          'l4_normalisee': '67 BOULEVARD DU GENERAL LECLERC',
          'l5_normalisee': null,
          'l6_normalisee': '92110 CLICHY',
          'code_postal': '92110',
          'libelle_activite_principale': 'Vente à distance sur catalogue général',
          'highlight': 'Pour tout problème concernant le site de vente en ligne Amazon'
        }
      ]
    },
    {
      query: /\bmaif\b/i,
      results: [
        {
          'siret': '77570970201646',
          'nom_raison_sociale': 'MUTUELLE ASSURANCE INSTITUTEUR FRANCE',
          'l1_normalisee': 'MUTUELLE ASSURANCE INSTITUTEUR FRANCE',
          'l2_normalisee': 'MAIF',
          'l3_normalisee': null,
          'l4_normalisee': '200 AVENUE SALVADOR ALLENDE',
          'l5_normalisee': 'BP 303',
          'l6_normalisee': '79000 NIORT',
          'code_postal': '79000',
          'libelle_activite_principale': 'Autres assurances',
          'highlight': 'Pour tout problème concernant votre assureur, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bgrdf\b/i,
      results: [
        {
          'siret': '44478651100022',
          'nom_raison_sociale': 'GRDF',
          'l1_normalisee': 'GRDF',
          'l2_normalisee': 'TSA 60800',
          'l3_normalisee': null,
          'l4_normalisee': '6 RUE CONDORCET',
          'l5_normalisee': null,
          'l6_normalisee': '75009 PARIS 9',
          'code_postal': '75009',
          'libelle_activite_principale': 'Distribution de combustibles gazeux par conduites',
          'highlight': 'Pour tout problème avec GRDF, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\b(erdf)|([ée]n[ée]dis?)\b/i,
      results: [
        {
          'siret': '44460844213631',
          'nom_raison_sociale': 'ENEDIS',
          'l1_normalisee': 'ENEDIS',
          'l2_normalisee': null,
          'l3_normalisee': null,
          'l4_normalisee': '34 PLACE DES COROLLES',
          'l5_normalisee': null,
          'l6_normalisee': '92400 COURBEVOIE',
          'code_postal': '92400',
          'libelle_activite_principale': 'Distribution d\'électricité',
          'highlight': 'Pour tout problème avec ENEDIS, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bcanal\+?\b/i,
      results: [
        {
          "siret": "42062477700108",
          "nom_raison_sociale": "GROUPE CANAL+ SA",
          "l1_normalisee": "GROUPE CANAL+ SA",
          "l2_normalisee": "CANAL",
          "l3_normalisee": null,
          "l4_normalisee": "1 PLACE DU SPECTACLE",
          "l5_normalisee": null,
          "l6_normalisee": "92130 ISSY-LES-MOULINEAUX",
          "code_postal": "92130",
          "libelle_activite_principale": "Activités des sociétés holding",
          "highlight": "Pour tout ce qui concerne Canal+ et ses différents services"
        }
      ]
    },
  ];

  searchCompanies(search: string, searchPostalCode: string) {
    const match = this.searchHooks.find(hook => hook.query.test(search));
    return super.searchCompanies(search, searchPostalCode).pipe(
      map(results => {
        if (match !== undefined) {
          const matches = Object.assign(new CompanySearchResults(), {
            total: match.results.length,
            etablissement: match.results
          });
          matches.companies.filter(c => !c.highlight).forEach(c => c.highlight = 'Pour tout signalement relatif à votre opérateur (contrat, forfait, etc.)');
          results.companies = [
            ...matches.companies,
            ...results.companies.filter(c =>
              !match.results.find(r => r.siret === c.siret)
            )];
          results.total = results.companies.length;
        }
        return results;
      })
    );
  }

  searchCompaniesBySiret(siret: string) {
    if (siret === this.DGCCRF_DATA.siret) {
      return of(Object.assign(new CompanySearchResult(), this.DGCCRF_DATA));
    } else {
      return super.searchCompaniesBySiret(siret);
    }
  }
}

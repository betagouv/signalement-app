import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { map, mergeMap } from 'rxjs/operators';
import { Company, CompanySearchResult } from '../model/Company';

export const MaxCompanyResult = 20;

class RawCompanyService {

  constructor(protected http: HttpClient,
    protected serviceUtils: ServiceUtils) {}

  searchCompanies(search: string, searchPostalCode: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('postalCode', searchPostalCode.toString());
    httpParams = httpParams.append('q', search);
    return this.http.get<CompanySearchResult[]>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'search']),
      {
        params: httpParams
      }
    );
  }

  searchCompaniesByIdentity(identity: string) {
    return this.http.get<CompanySearchResult[]>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'search', identity]),
    ).pipe(
      map(companies => companies.filter(company => company.postalCode))
    );
  }

  searchCompaniesByUrl(url: string) {
    return this.http.get<CompanySearchResult[]>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'search-url']),
      { params: {url: url}}
    );
  }

  searchRegisterCompanies(search: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('q', search);
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<Company[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'search', 'registered']),
          Object.assign(headers, { params: httpParams })
        );
      })
    );
  }

  updateCompanyAddress(siret: string, address: string, postalCode: string, activationDocumentRequired: boolean) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.put<Company>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'companies', siret, 'address']),
          {
            address,
            postalCode,
            activationDocumentRequired
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

  private DGCCRF_DATA = <CompanySearchResult> {
    siret: '12002503600035',
    name: 'DIRECTION GENERALE DE LA CONCURRENCE, DE LA CONSOMMATION ET DE LA REPRESSION DES FRAUDES',
    address: 'TELEDOC 071 - 59 BD VINCENT AURIOL - 75013 PARIS 13',
    postalCode: '75013',
    activityLabel: 'Administration publique (tutelle) des activités économiques',
    highlight: null
  };

  private searchHooks = [
    {
      query: /\borange\b/i,
      results: [
        <CompanySearchResult> {
          siret: '38012986645100',
          name: 'ORANGE',
          address: 'BAT A - 1 AVENUE DU PDT NELSON MANDELA - 94110 ARCUEIL',
          postalCode: '94110',
          activityLabel: 'Commerce de détail de matériels de télécommunication en magasin spécialisé',
          highlight: null
        }
      ]
    },
    {
      query: /\bsfr\b/i,
      results: [
        <CompanySearchResult> {
          siret: '34305956400959',
          name: 'SOCIETE FRANCAISE DU RADIOTELEPHONE - SFR',
          brand: 'SFR',
          address: '16 RUE DU GENERAL DE BOISSIEU - 75015 PARIS 15',
          postalCode: '75015',
          activityLabel: 'Télécommunications sans fil',
          highlight: null
        }
      ]
    },
    {
      query: /\bbouygues?\b/i,
      results: [
        <CompanySearchResult> {
          siret: '39748093003464',
          name: 'BOUYGUES TELECOM',
          address: '13 A 15 - 13 AVENUE DU MARECHAL JUIN - 92360 MEUDON',
          postalCode: '92360',
          activityLabel: 'Autres activités informatiques',
          highlight: null
        }
      ]
    },
    {
      query: /\bfree\b/i,
      results: [
        <CompanySearchResult> {
          siret: '49924713800021',
          name: 'FREE MOBILE',
          address: '16 RUE DE LA VILLE L EVEQUE - 75008 PARIS 8',
          postalCode: '75008',
          activityLabel: 'Télécommunications sans fil',
          highlight: null
        },
        <CompanySearchResult> {
          siret: '42193886100034',
          name: 'FREE',
          address: '8 RUE DE LA VILLE L EVEQUE - 75008 PARIS 8',
          postalCode: '75008',
          activityLabel: 'Télécommunications filaires',
          highlight: null
        }
      ]
    },
    {
      query: /\beni\b/i,
      results: [
        <CompanySearchResult> {
          siret: '45122569200024',
          name: 'ENI GAS & POWER FRANCE',
          brand: 'ENI',
          address: '24 RUE JACQUES IBERT - 92300 LEVALLOIS-PERRET',
          postalCode: '92300',
          activityLabel: 'Commerce de combustibles gazeux par conduites',
          highlight: 'Pour tout signalement relatif à ENI (abonnements énergétiques, gaz, etc.)'
        }
      ]
    },
    {
      query: /\bamazone?\b/i,
      results: [
        <CompanySearchResult> {
          siret: '48777332700027',
          name: 'AMAZON EU SARL',
          brand: 'AMAZON EU SARL SUCCURSALE FRANCAISE',
          address: '67 BOULEVARD DU GENERAL LECLERC - 92110 CLICHY',
          postalCode: '92110',
          activityLabel: 'Vente à distance sur catalogue général',
          highlight: 'Pour tout problème concernant le site de vente en ligne Amazon'
        }
      ]
    },
    {
      query: /\bmaif\b/i,
      results: [
        <CompanySearchResult> {
          siret: '77570970201646',
          name: 'MUTUELLE ASSURANCE INSTITUTEUR FRANCE',
          brand: 'MAIF',
          address: '200 AVENUE SALVADOR ALLENDE - BP 303 - 79000 NIORT',
          postalCode: '79000',
          activityLabel: 'Autres assurances',
          highlight: 'Pour tout problème concernant votre assureur, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bgrdf\b/i,
      results: [
        <CompanySearchResult> {
          siret: '44478651100022',
          name: 'GRDF',
          address: 'TSA 60800 - 6 RUE CONDORCET - 75009 PARIS 9',
          postalCode: '75009',
          activityLabel: 'Distribution de combustibles gazeux par conduites',
          highlight: 'Pour tout problème avec GRDF, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\b(erdf)|([ée]n[ée]dis?)\b/i,
      results: [
        <CompanySearchResult> {
          siret: '44460844213631',
          name: 'ENEDIS',
          address: '34 PLACE DES COROLLES - 92400 COURBEVOIE',
          postalCode: '92400',
          activityLabel: 'Distribution d\'électricité',
          highlight: 'Pour tout problème avec ENEDIS, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bcanal\+?\b/i,
      results: [
        <CompanySearchResult> {
          siret: '42062477700108',
          name: 'GROUPE CANAL+ SA',
          brand: 'CANAL',
          address: '1 PLACE DU SPECTACLE - 92130 ISSY-LES-MOULINEAUX',
          postalCode: '92130',
          activityLabel: 'Activités des sociétés holding',
          highlight: 'Pour tout ce qui concerne Canal+ et ses différents services'
        }
      ]
    },
    {
      query: /\bbooking(\.com)?\b/i,
      results: [
        <CompanySearchResult> {
          siret: '84455159800015',
          name: 'PMDE BOOKING.COM BV',
          brand: 'BOOKING.COM',
          address: null,
          postalCode: null,
          activityLabel: 'Activités des sièges sociaux',
          highlight: 'Pour un problème relatif à une réservation sur le site Booking.com',
        }
      ]
    },
    {
      query: /\bpaypal(\.com)?\b/i,
      results: [
        <CompanySearchResult> {
          siret: '82501514200011',
          name: 'PAYPAL EUROPE ET CIE SCA',
          address: null,
          postalCode: null,
          activityLabel: 'Conseil pour les affaires et autres conseils de gestion',
          highlight: 'Pour un problème relatif au service PayPal',
        }
      ]
    },
    {
      query: /\bengie\b/i,
      results: [
        <CompanySearchResult> {
          siret: '54210765113030',
          name: 'ENGIE',
          address: '1 PLACE SAMUEL DE CHAMPLAIN - 92400 COURBEVOIE',
          postalCode: '92400',
          activityLabel: 'Commerce de combustibles gazeux par conduites',
          highlight: 'Pour tout problème avec Engie, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bmatmut\b/i,
      results: [
        <CompanySearchResult> {
          siret: '77570148500101',
          name: 'MATMUT MUTUALITE',
          address: '66 RUE DE SOTTEVILLE - 76100 ROUEN',
          postalCode: '76100',
          activityLabel: 'Autres assurances',
          highlight: 'Pour tout problème avec la Matmut, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bsncf\b/i,
      results: [
        <CompanySearchResult> {
          siret: '39284731500067',
          name: 'SNCF VOYAGES DEVELOPPEMENT',
          address: 'CNIT 1 - 2 PLACE DE LA DEFENSE - 92400 COURBEVOIE',
          postalCode: '92400',
          activityLabel: 'SNCF',
          highlight: 'Pour tout problème avec la SNCF, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bedf\b/i,
      results: [
        <CompanySearchResult> {
          siret: '55208131766522',
          name: 'ELECTRICITE DE FRANCE',
          address: '22 AVENUE DE WAGRAM - 75008 PARIS 8',
          postalCode: '75008',
          activityLabel: 'Production d\'électricité',
          highlight: 'Pour tout problème avec EDF, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\beurostar\b/i,
      results: [
        <CompanySearchResult> {
          siret: '84535345700011',
          name: 'EUROSTAR FRANCE SAS',
          address: '5 RUE DU DELTA - 75009 PARIS 9',
          postalCode: '75009',
          activityLabel: 'Transports urbains et suburbains de voyageurs',
          highlight: 'Pour tout problème avec Eurostar, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bveolia\b/i,
      results: [
        <CompanySearchResult> {
          siret: '40321003200104',
          name: 'VEOLIA ENVIRONNEMENT',
          address: '21 RUE LA BOETIE - 75008 PARIS 8',
          postalCode: '75008',
          activityLabel: 'Activités des sièges sociaux',
          highlight: 'Pour tout problème avec Veolia Environnement, peu importe votre lieu d\'habitation'
        },
        <CompanySearchResult> {
          siret: '57202552610945',
          name: 'VEOLIA EAU - COMPAGNIE GENERALE DES EAUX',
          address: '21 RUE LA BOETIE - 75008 PARIS 8',
          postalCode: '75008',
          activityLabel: 'Captage, traitement et distribution d\'eau',
          highlight: 'Pour tout problème avec Veolia Eau, peu importe votre lieu d\'habitation'
        }
      ]
    },
    {
      query: /\bharmonie( )?mutuelle\b/i,
      results: [
        <CompanySearchResult> {
          siret: '53851847300011',
          name: 'HARMONIE MUTUELLE',
          address: '143 RUE BLOMET - 75015 PARIS 15',
          postalCode: '75015',
          activityLabel: 'Autres assurances',
          highlight: 'Pour tout problème avec Harmonie Mutuelle, peu importe votre lieu d\'habitation'
        }
      ]
    },
  ];

  searchCompanies(search: string, searchPostalCode: string) {
    const match = this.searchHooks.find(hook => hook.query.test(search));
    return super.searchCompanies(search, searchPostalCode).pipe(
      map(results => {
        if (match && match.results) {
          const matches = match.results;
          matches.filter(c => !c.highlight).forEach(c => c.highlight = 'Pour tout signalement relatif à votre opérateur (contrat, forfait, etc.)');
          results = [
            ...matches,
            ...results.filter(c =>
              !match.results.find(r => r.siret === c.siret)
            )];
        }
        return results;
      })
    );
  }

  searchCompaniesByIdentity(identity: string) {
    if (identity === this.DGCCRF_DATA.siret) {
      return of([this.DGCCRF_DATA]);
    } else {
      return super.searchCompaniesByIdentity(identity);
    }
  }
}

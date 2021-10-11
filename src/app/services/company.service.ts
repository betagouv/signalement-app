import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Country } from '@betagouv/signalconso-api-sdk-js';
import { ApiSdkService } from './core/api-sdk.service';
import { FetchService } from './helper/FetchService';
import { CompanySearchResult } from '../model/Company';

@Injectable({ providedIn: 'root' })
export class SearchCompanyByURLService extends FetchService<CompanySearchResult[]> {

  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.company.searchCompaniesByUrl);
  }
}

@Injectable({ providedIn: 'root' })
export class SearchCompanyService extends FetchService<CompanySearchResult[]> {

  constructor(protected api: ApiSdkService) {
    super(api, (search: string, searchPostalCode: string) => {
      const match = this.searchHooks.find(hook => hook.query.test(search));
      return api.unsecured.company.searchCompanies(search, searchPostalCode).then(results => {
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
      });
    });
  }

  private readonly searchHooks = [
    {
      query: /\borange\b/i,
      results: [
        <CompanySearchResult> {
          siret: '38012986645100',
          name: 'ORANGE',
          address: {
            number: '1',
            street: 'VENUE DU PDT NELSON MANDELA',
            postalCode: '94110',
            addressSupplement: 'BAT A',
            city: 'ARCUEIL',
          },
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
          address: {
            number: '16',
            street: 'RUE DU GENERAL DE BOISSIEU',
            postalCode: '75015',
            city: 'PARIS 15',
          },
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
          address: {
            number: '13',
            addressSupplement: '13 A 15',
            street: 'AVENUE DU MARECHAL JUIN',
            postalCode: '92360',
            city: 'MEUDON',
          },
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
          address: {
            number: '16',
            street: 'RUE DE LA VILLE L EVEQUE',
            postalCode: '75008',
            city: 'PARIS 8',
          },
          activityLabel: 'Télécommunications sans fil',
          highlight: null
        },
        <CompanySearchResult> {
          siret: '42193886100034',
          name: 'FREE',
          address: {
            number: '8',
            street: 'RUE DE LA VILLE L EVEQUE',
            postalCode: '75008',
            city: 'PARIS 8',
          },
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
          address: {
            number: '24',
            street: 'RUE JACQUES IBERT',
            postalCode: '92300',
            city: 'LEVALLOIS-PERRET',
          },
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
          address: {
            number: '67',
            street: 'BOULEVARD DU GENERAL LECLERC',
            postalCode: '92110',
            city: 'CLICHY',
          },
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
          address: {
            number: '200',
            addressSupplement: 'BP 303',
            street: 'AVENUE SALVADOR ALLENDE',
            postalCode: '79000',
            city: 'NIORT',
          },
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
          address: {
            number: '6',
            addressSupplement: 'TSA 60800',
            street: 'RUE CONDORCET',
            postalCode: '75009',
            city: 'PARIS 9',
          },
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
          address: {
            number: '34',
            street: 'PLACE DES COROLLES',
            postalCode: '92400',
            city: 'COURBEVOIE',
          },
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
          address: {
            number: '1',
            street: 'PLACE DU SPECTACLE',
            postalCode: '92130',
            city: 'ISSY-LES-MOULINEAUX',
          },
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
          address: {},
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
          address: {},
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
          address: {
            number: '1',
            street: 'PLACE SAMUEL DE CHAMPLAIN',
            postalCode: '92400',
            city: 'COURBEVOIE',
          },
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
          address: {
            number: '66',
            street: 'RUE DE SOTTEVILLE',
            postalCode: '76100',
            city: 'ROUEN',
          },
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
          address: {
            number: '2',
            street: 'PLACE DE LA DEFENSE',
            addressSupplement: 'CNIT 1',
            postalCode: '92400',
            city: 'COURBEVOIE',
          },
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
          address: {
            number: '22',
            street: 'AVENUE DE WAGRAM',
            postalCode: '75008',
            city: 'PARIS 8',
          },
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
          address: {
            number: '5',
            street: 'RUE DU DELTA',
            postalCode: '75009',
            city: 'PARIS 9',
          },
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
          address: {
            number: '21',
            street: 'RUE LA BOETIE',
            postalCode: '75008',
            city: 'PARIS 8',
          },
          activityLabel: 'Activités des sièges sociaux',
          highlight: 'Pour tout problème avec Veolia Environnement, peu importe votre lieu d\'habitation'
        },
        <CompanySearchResult> {
          siret: '57202552610945',
          name: 'VEOLIA EAU - COMPAGNIE GENERALE DES EAUX',
          address: {
            number: '21',
            street: 'RUE LA BOETIE',
            postalCode: '75008',
            city: 'PARIS 8',
          },
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
          address: {
            number: '143',
            street: 'RUE BLOMET',
            postalCode: '75015',
            city: 'PARIS 15',
          },
          activityLabel: 'Autres assurances',
          highlight: 'Pour tout problème avec Harmonie Mutuelle, peu importe votre lieu d\'habitation'
        }
      ]
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class SearchCompanyByIdentityService extends FetchService<CompanySearchResult[]> {

  constructor(protected api: ApiSdkService) {
    super(api, (identity: string) => (identity === this.dgccrfCompany.siret)
      ? of([this.dgccrfCompany])
      : api.unsecured.company.searchCompaniesByIdentity(identity)
    );
  }

  private readonly dgccrfCompany = <CompanySearchResult> {
    siret: '12002503600035',
    name: 'DIRECTION GENERALE DE LA CONCURRENCE, DE LA CONSOMMATION ET DE LA REPRESSION DES FRAUDES',
    address: {
      number: '59',
      street: 'BD VINCENT AURIOL',
      addressSupplement: 'TELEDOC 071',
      postalCode: '75013',
      city: 'PARIS 13',
    },
    activityLabel: 'Administration publique (tutelle) des activités économiques',
    highlight: null
  };
}

@Injectable({ providedIn: 'root' })
export class SearchForeignCompanyByURLService extends FetchService<Country[]> {

  constructor(protected api: ApiSdkService) {
    super(api, api.unsecured.company.searchForeignCompaniesByUrl);
  }
}

import { TestBed } from '@angular/core/testing';

import { CompanyService } from './company.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';

describe('CompanyService', () => {

  let httpMock: HttpTestingController;
  let companyService: CompanyService;

  const result = {
    total_results: 2,
    total_pages: 1,
    per_page: 10,
    page: 1,
    etablissement: [
      {
        id: 191024365,
        siren: '428267942',
        siret: '42826794201192',
        nic: '01192',
        l1_normalisee: 'CASINO CARBURANTS',
        l2_normalisee: null,
        l3_normalisee: null,
        l4_normalisee: 'AVENUE DE LIMOGES',
        l5_normalisee: null,
        l6_normalisee: '87270 COUZEIX',
        l7_normalisee: 'FRANCE',
        l1_declaree: 'CASINO CARBURANTS',
        l2_declaree: null,
        l3_declaree: null,
        l4_declaree: 'AV DE LIMOGES',
        l5_declaree: null,
        l6_declaree: '87270 COUZEIX',
        l7_declaree: null,
        numero_voie: null,
        indice_repetition: null,
        type_voie: 'AV',
        libelle_voie: 'DE LIMOGES',
        code_postal: '87270',
        cedex: null,
        region: '75',
        libelle_region: 'Nouvelle-Aquitaine',
        departement: '87',
        arrondissement: '2',
        canton: '06',
        commune: '050',
        libelle_commune: 'COUZEIX',
        departement_unite_urbaine: '87',
        taille_unite_urbaine: '6',
        numero_unite_urbaine: '01',
        etablissement_public_cooperation_intercommunale: '248719312',
        tranche_commune_detaillee: '22',
        zone_emploi: '7404',
        is_siege: '0',
        enseigne: null,
        indicateur_champ_publipostage: '1',
        statut_prospection: 'O',
        date_introduction_base_diffusion: '201209',
        nature_entrepreneur_individuel: null,
        libelle_nature_entrepreneur_individuel: null,
        activite_principale: '4730Z',
        libelle_activite_principale: 'Commerce de détail de carburants en magasin spécialisé',
        date_validite_activite_principale: '2008',
        tranche_effectif_salarie: '00',
        libelle_tranche_effectif_salarie: '0 salarié',
        tranche_effectif_salarie_centaine_pret: '0',
        date_validite_effectif_salarie: '2004',
        origine_creation: '6',
        date_creation: '20041201',
        date_debut_activite: '20041201',
        nature_activite: 'NR',
        lieu_activite: '99',
        type_magasin: null,
        is_saisonnier: 'P',
        modalite_activite_principale: 'S',
        caractere_productif: 'O',
        participation_particuliere_production: null,
        caractere_auxiliaire: '0',
        nom_raison_sociale: 'CASINO CARBURANTS',
        sigle: null,
        nom: null,
        prenom: null,
        civilite: null,
        numero_rna: null,
        nic_siege: '01424',
        region_siege: '84',
        departement_commune_siege: '42218',
        email: null,
        nature_juridique_entreprise: '5710',
        libelle_nature_juridique_entreprise: 'SAS, société par actions simplifiée',
        activite_principale_entreprise: '4730Z',
        libelle_activite_principale_entreprise: 'Commerce de détail de carburants en magasin spécialisé',
        date_validite_activite_principale_entreprise: '2008',
        activite_principale_registre_metier: null,
        is_ess: null,
        date_ess: null,
        tranche_effectif_salarie_entreprise: '00',
        libelle_tranche_effectif_salarie_entreprise: '0 salarié',
        tranche_effectif_salarie_entreprise_centaine_pret: '0',
        date_validite_effectif_salarie_entreprise: '2004',
        categorie_entreprise: 'GE',
        date_creation_entreprise: '19991208',
        date_introduction_base_diffusion_entreprise: '201209',
        indice_monoactivite_entreprise: '5',
        modalite_activite_principale_entreprise: 'S',
        caractere_productif_entreprise: 'O',
        date_validite_rubrique_niveau_entreprise_esa: '2016',
        tranche_chiffre_affaire_entreprise_esa: '9',
        activite_principale_entreprise_esa: '4730Z',
        premiere_activite_secondaire_entreprise_esa: '4730Z',
        deuxieme_activite_secondaire_entreprise_esa: null,
        troisieme_activite_secondaire_entreprise_esa: null,
        quatrieme_activite_secondaire_entreprise_esa: null,
        nature_mise_a_jour: null,
        indicateur_mise_a_jour_1: null,
        indicateur_mise_a_jour_2: null,
        indicateur_mise_a_jour_3: null,
        date_mise_a_jour: '2014-06-07T00:00:00',
        created_at: '2019-04-04T03:34:37.000Z',
        updated_at: '2019-04-04T03:34:37.000Z',
        longitude: '1.2385',
        latitude: '45.870349',
        geo_score: '0.78',
        geo_type: 'street',
        geo_adresse: 'Avenue de Limoges 87270 Couzeix',
        geo_id: '87050_XXXX_cdb9a3',
        geo_ligne: 'G',
        geo_l4: null,
        geo_l5: null
      },
      {
        id: 191024373,
        siren: '428268023',
        siret: '42826802326254',
        nic: '26254',
        l1_normalisee: 'DISTRIBUTION CASINO FRANCE',
        l2_normalisee: null,
        l3_normalisee: null,
        l4_normalisee: '1 RUE DU DOCTEUR ROBERT PASCAUD',
        l5_normalisee: null,
        l6_normalisee: '87270 COUZEIX',
        l7_normalisee: 'FRANCE',
        l1_declaree: 'DISTRIBUTION CASINO FRANCE',
        l2_declaree: null,
        l3_declaree: null,
        l4_declaree: '1 RUE DU DOCTEUR ROBERT PASCAUD',
        l5_declaree: null,
        l6_declaree: '87270 COUZEIX',
        l7_declaree: null,
        numero_voie: '1',
        indice_repetition: null,
        type_voie: 'RUE',
        libelle_voie: 'DU DOCTEUR ROBERT PASCAUD',
        code_postal: '87270',
        cedex: null,
        region: '75',
        libelle_region: 'Nouvelle-Aquitaine',
        departement: '87',
        arrondissement: '2',
        canton: '06',
        commune: '050',
        libelle_commune: 'COUZEIX',
        departement_unite_urbaine: '87',
        taille_unite_urbaine: '6',
        numero_unite_urbaine: '01',
        etablissement_public_cooperation_intercommunale: '248719312',
        tranche_commune_detaillee: '22',
        zone_emploi: '7404',
        is_siege: '0',
        enseigne: null,
        indicateur_champ_publipostage: '1',
        statut_prospection: 'O',
        date_introduction_base_diffusion: '201209',
        nature_entrepreneur_individuel: null,
        libelle_nature_entrepreneur_individuel: null,
        activite_principale: '4711D',
        libelle_activite_principale: 'Supermarchés',
        date_validite_activite_principale: '2008',
        tranche_effectif_salarie: '12',
        libelle_tranche_effectif_salarie: '20 à 49 salariés',
        tranche_effectif_salarie_centaine_pret: '20',
        date_validite_effectif_salarie: '2016',
        origine_creation: '4',
        date_creation: '20000701',
        date_debut_activite: '20000701',
        nature_activite: 'NR',
        lieu_activite: '05',
        type_magasin: '3',
        is_saisonnier: 'P',
        modalite_activite_principale: 'S',
        caractere_productif: 'O',
        participation_particuliere_production: null,
        caractere_auxiliaire: '0',
        nom_raison_sociale: 'DISTRIBUTION CASINO FRANCE',
        sigle: 'DCF',
        nom: null,
        prenom: null,
        civilite: null,
        numero_rna: null,
        nic_siege: '37699',
        region_siege: '84',
        departement_commune_siege: '42218',
        email: null,
        nature_juridique_entreprise: '5710',
        libelle_nature_juridique_entreprise: 'SAS, société par actions simplifiée',
        activite_principale_entreprise: '4711F',
        libelle_activite_principale_entreprise: 'Hypermarchés',
        date_validite_activite_principale_entreprise: '2018',
        activite_principale_registre_metier: null,
        is_ess: 'N',
        date_ess: '20160101',
        tranche_effectif_salarie_entreprise: '53',
        libelle_tranche_effectif_salarie_entreprise: '10 000 salariés et plus',
        tranche_effectif_salarie_entreprise_centaine_pret: '30800',
        date_validite_effectif_salarie_entreprise: '2016',
        categorie_entreprise: 'GE',
        date_creation_entreprise: '19991208',
        date_introduction_base_diffusion_entreprise: '201209',
        indice_monoactivite_entreprise: '2',
        modalite_activite_principale_entreprise: 'S',
        caractere_productif_entreprise: 'O',
        date_validite_rubrique_niveau_entreprise_esa: '2016',
        tranche_chiffre_affaire_entreprise_esa: '9',
        activite_principale_entreprise_esa: '1071B',
        premiere_activite_secondaire_entreprise_esa: '4711F',
        deuxieme_activite_secondaire_entreprise_esa: null,
        troisieme_activite_secondaire_entreprise_esa: null,
        quatrieme_activite_secondaire_entreprise_esa: null,
        nature_mise_a_jour: null,
        indicateur_mise_a_jour_1: null,
        indicateur_mise_a_jour_2: null,
        indicateur_mise_a_jour_3: null,
        date_mise_a_jour: '2017-01-29T00:00:00',
        created_at: '2019-04-04T03:34:37.000Z',
        updated_at: '2019-04-04T03:34:37.000Z',
        longitude: '1.23483',
        latitude: '45.881933',
        geo_score: '0.86',
        geo_type: 'street',
        geo_adresse: 'Rue du Docteur Robert Pascaud 87270 Couzeix',
        geo_id: '87050_0255_e537e0',
        geo_ligne: 'G',
        geo_l4: null,
        geo_l5: null
      }
    ],
    spellcheck: null
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      ServiceUtils,
    ]
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    companyService = TestBed.inject(CompanyService);
  });

  it('should be created', () => {
    expect(companyService).toBeTruthy();
  });
/*
  it('should map the result into a CompanySearchResult object', (done) => {

    const search = 'recherche';
    const searchPostalCode = '87270';

    companyService.searchCompanies(search, searchPostalCode).subscribe(companySearchResult => {
      expect(companySearchResult.total).toEqual(result.total_results);
      expect(companySearchResult.companies.length).toEqual(result.etablissement.length);
      expect(companySearchResult.companies[0].name).toEqual(result.etablissement[0].nom_raison_sociale);
      expect(companySearchResult.companies[0].sign).toEqual(result.etablissement[0].enseigne);
      expect(companySearchResult.companies[0].line1).toEqual(result.etablissement[0].l1_normalisee);
      expect(companySearchResult.companies[0].line2).toEqual(result.etablissement[0].l2_normalisee);
      expect(companySearchResult.companies[0].line3).toEqual(result.etablissement[0].l3_normalisee);
      expect(companySearchResult.companies[0].line4).toEqual(result.etablissement[0].l4_normalisee);
      expect(companySearchResult.companies[0].line5).toEqual(result.etablissement[0].l5_normalisee);
      expect(companySearchResult.companies[0].line6).toEqual(result.etablissement[0].l6_normalisee);
      expect(companySearchResult.companies[0].line7).toEqual(result.etablissement[0].l7_normalisee);
      expect(companySearchResult.companies[0].siret).toEqual(result.etablissement[0].siret);
      expect(companySearchResult.companies[0].postalCode).toEqual(result.etablissement[0].code_postal);
      expect(companySearchResult.companies[0].activityLabel).toEqual(result.etablissement[0].libelle_activite_principale);
      expect(companySearchResult.companies[1].name).toEqual(result.etablissement[1].nom_raison_sociale);
      expect(companySearchResult.companies[1].sign).toEqual(result.etablissement[1].enseigne);
      expect(companySearchResult.companies[1].line1).toEqual(result.etablissement[1].l1_normalisee);
      expect(companySearchResult.companies[1].line2).toEqual(result.etablissement[1].l2_normalisee);
      expect(companySearchResult.companies[1].line3).toEqual(result.etablissement[1].l3_normalisee);
      expect(companySearchResult.companies[1].line4).toEqual(result.etablissement[1].l4_normalisee);
      expect(companySearchResult.companies[1].line5).toEqual(result.etablissement[1].l5_normalisee);
      expect(companySearchResult.companies[1].line6).toEqual(result.etablissement[1].l6_normalisee);
      expect(companySearchResult.companies[1].line7).toEqual(result.etablissement[1].l7_normalisee);
      expect(companySearchResult.companies[1].siret).toEqual(result.etablissement[1].siret);
      expect(companySearchResult.companies[1].postalCode).toEqual(result.etablissement[1].code_postal);
      expect(companySearchResult.companies[1].activityLabel).toEqual(result.etablissement[1].libelle_activite_principale);
      done();
    });

    const companiesRequest = httpMock.expectOne(
      `${environment.apiCompanyBaseUrl}/api/sirene/v1/full_text/${search}?code_postal=${searchPostalCode}&per_page=${MaxCompanyResult}`
    );
    companiesRequest.flush(result);

  });

  it('should catch error with status 404 and return a CompanySearchResult object', (done) => {

    const search = 'recherche';
    const searchPostalCode = '87270';

    companyService.searchCompanies(search, searchPostalCode).subscribe(companySearchResult => {
      expect(companySearchResult.total).toEqual(0);
      done();
    });

    const companiesRequest = httpMock.expectOne(
      `${environment.apiCompanyBaseUrl}/api/sirene/v1/full_text/${search}?code_postal=${searchPostalCode}&per_page=${MaxCompanyResult}`
    );
    companiesRequest.flush({ message: 'no results found' }, {status: 404, statusText: 'not found'});
  });

 */

});

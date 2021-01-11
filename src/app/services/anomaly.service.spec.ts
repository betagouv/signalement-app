import { AnomalyService } from './anomaly.service';
import { TestBed } from '@angular/core/testing';
import { Anomaly, enrichAnomaly } from '../model/Anomaly';

const testParsing = (initial: Anomaly[], expected: Anomaly[]): void => {
  expect(JSON.parse(JSON.stringify(initial.map(enrichAnomaly)))).toEqual(expected);
};

describe('enrichAnomaly', () => {

  it('should not change anything', () => {
    testParsing(
      [{
        'category': 'COVID-19 (coronavirus)',
        'categoryId': 'C19',
        'path': 'coronavirus',
        'description': 'gel hydroalcoolique, masque, arnaque liée au COVID-19, distanciation physique...',
        'rank': 1,
        'sprite': 'category-covid',
        'subcategories': [
          {
            'title': 'Problème / abus avec un site de vente en ligne',
            'example': 'Exemple : site de livraison de courses à domicile',
            'companyKind': 'WEBSITE',
            'subcategories': [
              {
                'title': 'Le prix de la livraison a augmenté',
                'tags': ['Litige contractuel'],
                'detailInputs': [
                  {
                    'label': 'Date du constat',
                    'rank': 1,
                    'type': 'DATE',
                    'defaultValue': 'SYSDATE'
                  },
                  {
                    'label': 'Quel est le problème avec le prix de la livraison ?',
                    'rank': 2,
                    'type': 'TEXTAREA'
                  }
                ]
              }
            ]
          }
        ]
      }]
      ,
      [{
        'category': 'COVID-19 (coronavirus)',
        'categoryId': 'C19',
        'path': 'coronavirus',
        'description': 'gel hydroalcoolique, masque, arnaque liée au COVID-19, distanciation physique...',
        'rank': 1,
        'sprite': 'category-covid',
        'subcategories': [
          {
            'title': 'Problème / abus avec un site de vente en ligne',
            'example': 'Exemple : site de livraison de courses à domicile',
            'companyKind': 'WEBSITE',
            'subcategories': [
              {
                'title': 'Le prix de la livraison a augmenté',
                'tags': ['Litige contractuel'],
                'companyKind': 'WEBSITE',
                'detailInputs': [
                  {
                    'label': 'Date du constat',
                    'rank': 1,
                    'type': 'DATE',
                    'defaultValue': 'SYSDATE'
                  },
                  {
                    'label': 'Quel est le problème avec le prix de la livraison ?',
                    'rank': 2,
                    'type': 'TEXTAREA'
                  }
                ]
              }
            ]
          }
        ]
      }]);
  });

  it('should add internet subcategory', () => {
    testParsing(
      [{
        'category': 'COVID-19 (coronavirus)',
        'categoryId': 'C19',
        'path': 'coronavirus',
        'description': 'gel hydroalcoolique, masque, arnaque liée au COVID-19, distanciation physique...',
        'rank': 1,
        'sprite': 'category-covid',
        'subcategories': [
          {
            'title': 'Les prix (gel désinfectant, masque) sont trop élevés',
            'subcategoriesTitle': 'De quel produit s\'agit-il&#160;?',
            'subcategories': [
              {
                'title': 'Autre'
              }
            ]
          }]
      }]
      ,
      [{
        'category': 'COVID-19 (coronavirus)',
        'categoryId': 'C19',
        'path': 'coronavirus',
        'description': 'gel hydroalcoolique, masque, arnaque liée au COVID-19, distanciation physique...',
        'rank': 1,
        'sprite': 'category-covid',
        'subcategories': [
          {
            'title': 'Les prix (gel désinfectant, masque) sont trop élevés',
            'subcategoriesTitle': 'De quel produit s\'agit-il&#160;?',
            'subcategories': [
              {
                'title': 'Autre',
                'subcategoriesTitle': 'Est-ce que votre problème concerne une entreprise sur internet ?',
                'subcategories': [
                  {
                    'title': 'Oui',
                    'companyKind': 'WEBSITE'
                  },
                  {
                    'title': 'Non, pas sur internet',
                    'companyKind': 'SIRET'
                  }
                ]
              }]
          }]
      }]
    );
  });

  it('should not add internet subcategory on information category.', () => {
    testParsing(
      [{
        'category': 'COVID-19 (coronavirus)',
        'categoryId': 'C19',
        'path': 'coronavirus',
        'description': 'gel hydroalcoolique, masque, arnaque liée au COVID-19, distanciation physique...',
        'rank': 1,
        'sprite': 'category-covid',
        'subcategories': [
          {
            'title': 'Arnaque et publicité mensongère liées au COVID-19',
            'example': 'Exemple : publicité trompeuse utilisant l\'argument du COVID-19, faux désinfecteur'
          },
          {
            'title': 'Ouverture non autorisée d\'un commerce ou lieu recevant du public',
            'information': {
              'content': 'Si vous souhaitez signaler une entreprise qui ne respecte pas les consignes liées au confinement, vous devez contacter les services de police. <br> La répression des fraudes ne peut pas intervenir pour ce type de problème.'
            }
          },
        ]
      }]
      ,
      [{
        'category': 'COVID-19 (coronavirus)',
        'categoryId': 'C19',
        'path': 'coronavirus',
        'description': 'gel hydroalcoolique, masque, arnaque liée au COVID-19, distanciation physique...',
        'rank': 1,
        'sprite': 'category-covid',
        'subcategories': [
          {
            'title': 'Arnaque et publicité mensongère liées au COVID-19',
            'example': 'Exemple : publicité trompeuse utilisant l\'argument du COVID-19, faux désinfecteur',
            'subcategoriesTitle': 'Est-ce que votre problème concerne une entreprise sur internet ?',
            'subcategories': [
              {
                'title': 'Oui',
                'companyKind': 'WEBSITE'
              },
              {
                'title': 'Non, pas sur internet',
                'companyKind': 'SIRET'
              }
            ]
          }, {
            'title': 'Ouverture non autorisée d\'un commerce ou lieu recevant du public',
            'information': {
              'content': 'Si vous souhaitez signaler une entreprise qui ne respecte pas les consignes liées au confinement, vous devez contacter les services de police. <br> La répression des fraudes ne peut pas intervenir pour ce type de problème.'
            }
          }
        ]
      }]
    );
  });

  it('should add internet subcategory and compy detailInputs related fields', () => {
    testParsing(
      [{
        'category': 'COVID-19 (coronavirus)',
        'categoryId': 'C19',
        'path': 'coronavirus',
        'description': 'gel hydroalcoolique, masque, arnaque liée au COVID-19, distanciation physique...',
        'rank': 1,
        'sprite': 'category-covid',
        'subcategories': [
          {
            'title': 'Les prix (gel désinfectant, masque) sont trop élevés',
            'subcategoriesTitle': 'De quel produit s\'agit-il&#160;?',
            'subcategories': [
              {
                'title': 'Gel désinfectant (gel hydroalcoolique)',
                'description': 'Le prix des gels hydroalcooliques est réglementé (décret n° 2020-293 du 23 mars 2020). Pour un consommateur, les prix maximums sont&nbsp;:&nbsp; <ul> <li>1,76€ pour un flacon de 50 ml</li> <li>2,64€ pour 100 ml</li> <li>4,4€ pour 300 ml</li> <li>13,19€ pour un litre</li> </ul> Il existe des exceptions à ces prix en fonction par exemple du type de contenant.',
                'detailInputs': [],
                'fileLabel': 'Photo du prix et du produit si possible'
              },
            ]
          },
        ]
      }]
      ,
      [{
        'category': 'COVID-19 (coronavirus)',
        'categoryId': 'C19',
        'path': 'coronavirus',
        'description': 'gel hydroalcoolique, masque, arnaque liée au COVID-19, distanciation physique...',
        'rank': 1,
        'sprite': 'category-covid',
        'subcategories': [
          {
            'title': 'Les prix (gel désinfectant, masque) sont trop élevés',
            'subcategoriesTitle': 'De quel produit s\'agit-il&#160;?',
            'subcategories': [
              {
                'title': 'Gel désinfectant (gel hydroalcoolique)',
                'detailInputs': [],
                'fileLabel': 'Photo du prix et du produit si possible',
                'subcategoriesTitle': 'Est-ce que votre problème concerne une entreprise sur internet ?',
                'subcategories': [
                  {
                    'title': 'Oui',
                    'description': 'Le prix des gels hydroalcooliques est réglementé (décret n° 2020-293 du 23 mars 2020). Pour un consommateur, les prix maximums sont&nbsp;:&nbsp; <ul> <li>1,76€ pour un flacon de 50 ml</li> <li>2,64€ pour 100 ml</li> <li>4,4€ pour 300 ml</li> <li>13,19€ pour un litre</li> </ul> Il existe des exceptions à ces prix en fonction par exemple du type de contenant.',
                    'detailInputs': [],
                    'fileLabel': 'Photo du prix et du produit si possible',
                    'companyKind': 'WEBSITE'
                  },
                  {
                    'title': 'Non, pas sur internet',
                    'description': 'Le prix des gels hydroalcooliques est réglementé (décret n° 2020-293 du 23 mars 2020). Pour un consommateur, les prix maximums sont&nbsp;:&nbsp; <ul> <li>1,76€ pour un flacon de 50 ml</li> <li>2,64€ pour 100 ml</li> <li>4,4€ pour 300 ml</li> <li>13,19€ pour un litre</li> </ul> Il existe des exceptions à ces prix en fonction par exemple du type de contenant.',
                    'detailInputs': [],
                    'fileLabel': 'Photo du prix et du produit si possible',
                    'companyKind': 'SIRET'
                  }
                ]
              }
            ]
          }
        ]
      }]
    );
  });

  it('should propagate companyKind deeply', () => {
    testParsing([{
        'category': 'Café / Restaurant',
        'categoryId': 'CR',
        'path': 'cafe-restaurant',
        'description': 'bar, cafétéria, food truck, application pour se faire livrer un repas...',
        'rank': 4,
        'sprite': 'category-restaurant',
        'subcategories': [
          {
            'title': 'Hygiène',
            'companyKind': 'SIRET',
            'example': 'Exemple : locaux sales, rat, chaîne du froid',
            'tags': [
              'hygiène'
            ],
            'subcategoriesTitle': 'Vous voulez signaler&#160;:',
            'subcategories': [
              {
                'title': 'Hygiène des locaux et du matériel',
                'example': 'Exemple : cuisine sale, odeur de poubelle dans ma cour',
                'subcategories': [
                  {
                    'title': 'Je trouve les locaux sales ou dégradés',
                    'example': 'Exemple : cuisine sale, WC sale',
                    'detailInputs': [],
                    'fileLabel': 'Merci de joindre si possible une photo pour appuyer votre signalement.'
                  },
                ]
              },
            ]
          },
        ]
      }]
      ,
      [{
        'category': 'Café / Restaurant',
        'categoryId': 'CR',
        'path': 'cafe-restaurant',
        'description': 'bar, cafétéria, food truck, application pour se faire livrer un repas...',
        'rank': 4,
        'sprite': 'category-restaurant',
        'subcategories': [{
          'title': 'Hygiène',
          'companyKind': 'SIRET',
          'example': 'Exemple : locaux sales, rat, chaîne du froid',
          'tags': ['hygiène'],
          'subcategoriesTitle': 'Vous voulez signaler&#160;:',
          'subcategories': [{
            'title': 'Hygiène des locaux et du matériel',
            'example': 'Exemple : cuisine sale, odeur de poubelle dans ma cour',
            'subcategories': [{
              'title': 'Je trouve les locaux sales ou dégradés',
              'example': 'Exemple : cuisine sale, WC sale',
              'detailInputs': [],
              'fileLabel': 'Merci de joindre si possible une photo pour appuyer votre signalement.',
              'companyKind': 'SIRET'
            }],
            'companyKind': 'SIRET'
          }]
        }]
      }]
    );
  });
});

describe('AnomalyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: []
    });
  });

  it('should be created', () => {
    const service: AnomalyService = TestBed.inject(AnomalyService);
    expect(service).toBeTruthy();
  });
});

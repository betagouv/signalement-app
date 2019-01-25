import { TestBed } from '@angular/core/testing';

import { AnomalyService } from './anomaly.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Anomaly } from '../model/Anomaly';

describe('AnomalyService', () => {

  let anomalyService: AnomalyService;
  let httpMock: HttpTestingController;

  const anomaliesJson = {
    list:
      [
        {
          companyType: 'Café restaurant',
          anomalyTypeList: [
            {
              categorie: 'Hygiène',
              subcategories: [
                'Personnel sans coiffe ou gants',
                'Restaurant sale'
              ]
            }
          ]
        },
        {
          companyType: 'Commerçant de proximité (boulangerie, boucherie...)',
          anomalyTypeList: [
            {
              categorie: 'Hygiène',
              subcategories: [
                'Personnel sans coiffe ou gants'
              ]
            },
            {
              categorie: 'Produit alimentaire',
              subcategories: [
                'Date Limite de Consommation dépassée',
                'Intoxication, corps étranger',
                'Etiquetage non-conforme (absence ingrédients, des allergènes, de date limite, pas en langue française..)'
              ]
            }
          ]
        }
      ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  beforeEach( () => {
    anomalyService = TestBed.get(AnomalyService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: AnomalyService = TestBed.get(AnomalyService);
    expect(service).toBeTruthy();
  });
  
  describe('getAnomalies function', () => {

    it('should load anomalies from a Json file and return an array of Anomaly', () => {
            anomalyService.getAnomalies().subscribe(
        result => {
          expect(result).not.toBeNull();
          expect(result instanceof Array).toBeTruthy();
          expect(result.length).toBe(2);
          expect(result[0] instanceof Anomaly).toBeTruthy();
        }
      );

      const anomaliesRequest = httpMock.expectOne('./assets/data/anomalies.json');
      anomaliesRequest.flush(anomaliesJson);
    });
  });
});

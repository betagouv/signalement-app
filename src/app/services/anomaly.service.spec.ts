import { TestBed } from '@angular/core/testing';

import { AnomalyService } from './anomaly.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Anomaly } from '../model/Anomaly';

describe('AnomalieService', () => {

  let anomalieService: AnomalyService;
  let httpMock: HttpTestingController;

  const anomaliesJson = {
    list:
      [
        {
          typeEtablissement: 'Café restaurant',
          typeAnomalieList: [
            {
              categorie: 'Hygiène',
              precisionList: [
                'Personnel sans coiffe ou gants',
                'Restaurant sale'
              ]
            }
          ]
        },
        {
          typeEtablissement: 'Commerçant de proximité (boulangerie, boucherie...)',
          typeAnomalieList: [
            {
              categorie: 'Hygiène',
              precisionList: [
                'Personnel sans coiffe ou gants'
              ]
            },
            {
              categorie: 'Produit alimentaire',
              precisionList: [
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
    anomalieService = TestBed.get(AnomalyService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: AnomalyService = TestBed.get(AnomalyService);
    expect(service).toBeTruthy();
  });
  
  describe('getAnomalies function', () => {

    it('should load anomalies from a Json file and return an array of Anomaly', () => {
            anomalieService.getAnomalies().subscribe(
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

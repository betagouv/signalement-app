import { TestBed } from '@angular/core/testing';

import { SignalementService } from './signalement.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';
import { Signalement } from '../model/Signalement';
import { environment } from '../../environments/environment';

describe('SignalementService', () => {

  let signalementService: SignalementService;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      SignalementService,
      ServiceUtils,
    ]
  }));

  beforeEach(() => {
    signalementService = TestBed.get(SignalementService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: SignalementService = TestBed.get(SignalementService);
    expect(service).toBeTruthy();
  });

  describe('signalement creation', () => {

    it('should post an http request with data to the signalement creation API', (done) => {

      const dateConstat = new Date(2018, 2, 1);
      const signalement = new Signalement();
      signalement.typeEtablissement = 'typeEtablissement';
      signalement.nomEtablissement = 'nomEtablissement';
      signalement.adresseEtablissement = 'adresseEtablissement';
      signalement.description = 'desc';
      signalement.dateConstat = dateConstat;
      signalement.heureConstat = 5;
      signalement.nom = 'nom';
      signalement.prenom = 'prenom';
      signalement.email = 'email@mail.fr';
      signalement.photo = undefined;

      signalementService.createSignalement(signalement).subscribe( result => {
          done();
        }
      );

      const signalementRequest = httpMock.expectOne(`${environment.apiBaseUrl}/api/signalement`);
      signalementRequest.flush({});

      httpMock.verify();
      expect(signalementRequest.request.body.get('typeEtablissement')).toBe('typeEtablissement');
      expect(signalementRequest.request.body.get('nomEtablissement')).toBe('nomEtablissement');
      expect(signalementRequest.request.body.get('adresseEtablissement')).toBe('adresseEtablissement');
      expect(signalementRequest.request.body.get('description')).toBe('desc');
      expect(signalementRequest.request.body.get('dateConstat')).toBe('2018-03-01');
      expect(signalementRequest.request.body.get('heureConstat')).toBe('5');
      expect(signalementRequest.request.body.get('nom')).toBe('nom');
      expect(signalementRequest.request.body.get('nom')).toBe('nom');
      expect(signalementRequest.request.body.get('email')).toBe('email@mail.fr');

    });

  });
});

import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Company, CompanyFromAddok, CompanySearchResult } from '../model/Company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map } from 'rxjs/operators';
import { deserialize } from 'json-typescript-mapper';

export const MaxCompanyResult = 20;
export const Radius = 0.2;

// see https://wiki.openstreetmap.org/wiki/Map_Features
export const UNTAKE_POI_LIST = [
  'bicycle_parking',
  'bus_stop',
  'cathedral',
  'chapel',
  'church',
  'clinic',
  'clothes',
  'hospital',
  'military',
  'mosque',
  'place_of_worship',
  'police',
  'pitch',
  'religious',
  //'residential',
  'school',
  'shrine',
  'social_facility',
  'sports_centre',
  'stadium',
  'synagogue',
  'temple',
  'toilets',
  'townhall',
  'yes',
]

export const UNTAKE_NATURE_ACTIVITE_LIST = [
  '03', //	Extraction
  '04', //	Fabrication, production
  '07', //	Transport
  '08', //	Import, export
  '09', //	Commerce de gros ou intermédiaire du commerce
  '11', //	Profession libérale
  '13', //	Location de meublés
  '14', //	Bâtiments, travaux publics
  '15', //	Services aux entreprises
  '20', //	Donneur d'ordre
]

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  searchCompanies(search: string, searchPostalCode?: string) {
    let httpParams = new HttpParams();
    if (searchPostalCode) {
      httpParams = httpParams.append('postalCode', searchPostalCode.toString());
    }
    httpParams = httpParams.append('maxCount', MaxCompanyResult.toString());
    return this.http.get(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', search]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => deserialize(CompanySearchResult, result)),
      catchError(err => {
        if (err.status === 404) {
          return of(deserialize(CompanySearchResult, {total_results: 0}));
        } else {
          return throwError(err);
        }
      })
    );
  }

  searchCompaniesFromAddok(search: string) {
    return this.http.get(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'addok', search]),
    ).pipe(
      map(result => deserialize(CompanyFromAddok, result)),
      catchError(err => {
        if (err.status === 404) {
          return of(deserialize(CompanyFromAddok, {}));
        } else {
          return throwError(err);
        }
      })
    );
  }


  searchCompaniesBySiret(siret: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('siret', siret);
    httpParams = httpParams.append('maxCount', MaxCompanyResult.toString());
    return this.http.get(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'siret', siret]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => deserialize(Company, result['etablissement'])),
      catchError(err => {
        if (err.status === 404) {
          return of(undefined);
        } else {
          return throwError(err);
        }
      })
    );
  }

  getNearbyCompanies(lat: number, long: number, radius: number = Radius) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('lat', lat.toString());
    httpParams = httpParams.append('long', long.toString());
    httpParams = httpParams.append('radius', radius.toString());
    httpParams = httpParams.append('maxCount', MaxCompanyResult.toString());
    return this.http.get(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'nearby', '']),
      {
        params: httpParams
      }
    ).pipe(
      map(result => {
        return deserialize(CompanySearchResult, result);
      }),
      catchError(err => {
        if (err.status === 404) {
          return of(deserialize(CompanySearchResult, {total_results: 0}));
        } else {
          return throwError(err);
        }
      })
    );
  }

}

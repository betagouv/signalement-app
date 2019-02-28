import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CompanySearchResult } from '../model/Company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map } from 'rxjs/operators';
import { deserialize } from 'json-typescript-mapper';

export const MaxCompanyResult = 20;
export const Radius = 0.05;

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  searchCompanies(search: string, searchPostalCode: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('postalCode', searchPostalCode.toString());
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

  getNearbyCompanies(lat: number, long: number) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('lat', lat.toString());
    httpParams = httpParams.append('long', long.toString());
    httpParams = httpParams.append('radius', Radius.toString());
    httpParams = httpParams.append('maxCount', MaxCompanyResult.toString());
    return this.http.get('https://entreprise.data.gouv.fr/api/sirene/v1/near_point/',
      {
        params: httpParams
      }
    ).pipe(
      map(result => {
        result['etablissement'] = result['etablissements'];
        delete result['etablissements'];
        return deserialize(CompanySearchResult, result)
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

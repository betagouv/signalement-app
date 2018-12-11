import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CompanySearchResult } from '../model/Company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map } from 'rxjs/operators';
import { deserialize } from 'json-typescript-mapper';
import { City } from '../model/City';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  searchByNameAndCity(name: string, city: City | string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('maxCount', MaxCompanyResult.toString());
    const urlParams = ['api', 'companies', name];
    if (city instanceof City) {
      urlParams.push(city.name);
      httpParams = httpParams.append('postcode', city.postcode);
    } else {
      urlParams.push(city);
    }
    return this.http.get(
      this.serviceUtils.getUrl(Api.Signalement, urlParams),
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
}

export const MaxCompanyResult = 10;

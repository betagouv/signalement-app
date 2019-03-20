import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CompanySearchResult } from '../model/Company';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map } from 'rxjs/operators';
import { deserialize } from 'json-typescript-mapper';

export const MaxCompanyResult = 20;

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  searchCompanies(search: string, searchPostalCode: string) {
    return this.http.get(
      this.serviceUtils.getUrl(Api.Company, ['api', 'sirene', 'v1', 'full_text', `${search}?code_postal=${searchPostalCode}&per_page=${MaxCompanyResult}`])
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

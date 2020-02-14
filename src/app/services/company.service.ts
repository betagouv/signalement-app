import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Company, CompanySearchResult } from '../model/Company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map } from 'rxjs/operators';

export const MaxCompanyResult = 20;

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  searchCompanies(search: string, searchPostalCode: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('code_postal', searchPostalCode.toString());
    httpParams = httpParams.append('per_page', MaxCompanyResult.toString());
    return this.http.get<CompanySearchResult>(
      this.serviceUtils.getUrl(Api.Company, ['api', 'sirene', 'v1', 'full_text', search]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => Object.assign(new CompanySearchResult(), result)),
      catchError(err => {
        if (err.status === 404) {
          return of(Object.assign(new CompanySearchResult(), {
            total: 0,
            companies: []
          }));
        } else {
          return throwError(err);
        }
      })
    );
  }

  searchCompaniesBySiret(siret: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('maxCount', MaxCompanyResult.toString());
    return this.http.get<CompanySearchResult>(
      this.serviceUtils.getUrl(Api.Company, ['api', 'sirene', 'v1', 'siret', siret]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => {
        if (result['etablissement'] && result['etablissement']['code_postal']) {
          return Object.assign(new Company, result['etablissement']);
        }
      }),
      catchError(err => {
        if (err.status === 404) {
          return of(undefined);
        } else {
          return throwError(err);
        }
      })
    );
  }

}

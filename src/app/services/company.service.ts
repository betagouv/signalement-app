import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Company, CompanySearchResult } from '../model/Company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map } from 'rxjs/operators';

export const MaxCompanyResult = 20;
export const Radius = 0.2;

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
    return this.http.get<CompanySearchResult>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', search]),
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
    httpParams = httpParams.append('siret', siret);
    httpParams = httpParams.append('maxCount', MaxCompanyResult.toString());
    return this.http.get<CompanySearchResult>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'siret', siret]),
      {
        params: httpParams
      }
    ).pipe(
      map(result => Object.assign(new Company, result['etablissement'])),
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

import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CompanySearchResult } from '../model/Company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { catchError, map } from 'rxjs/operators';
import { deserialize } from 'json-typescript-mapper';
import { CompleterItem, RemoteData } from 'ng2-completer';

export const MaxCompanyResult = 20;

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private _suggestionData: SuggestionData;

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
    this._suggestionData = new SuggestionData(this.http, this.serviceUtils);
  }

  searchCompanies(search: string) {
    let httpParams = new HttpParams();
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

  get suggestionData() {
    return this._suggestionData;
  }

}

class SuggestionData extends RemoteData {

  constructor(http: HttpClient, serviceUtils: ServiceUtils) {
    super(http);
    this.remoteUrl(serviceUtils.getUrl(Api.Report, ['api', 'companies', 'suggest/']));
    this.dataField('suggestions');
  }

  public convertToItem(data: any): CompleterItem | null {
    return data ? {
      title: data.replace('*', ' ').replace('/', ' ')
    } as CompleterItem : data;
  }
}




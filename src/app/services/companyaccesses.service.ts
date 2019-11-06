import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { CompanyAccess } from '../model/CompanyAccess';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CompanyAccessesService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  listAccesses(siret: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<CompanyAccess[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'accesses', siret]),
          headers
        );
      })
    );
  }
}


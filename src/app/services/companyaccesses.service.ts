import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  updateAccess(siret: string, userId: string, level: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.put(
          this.serviceUtils.getUrl(Api.Report, ['api', 'accesses', siret, userId]),
          {
            level: level
          },
          headers
        );
      })
    );
  }

  removeAccess(siret: string, userId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.delete(
          this.serviceUtils.getUrl(Api.Report, ['api', 'accesses', siret, userId]),
          headers
        );
      })
    );
  }

  sendInvitation(siret: string, email: string, level: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'accesses', siret, 'invitation']),
          {
            email: email,
            level: level
          },
          headers
        );
      })
    );
  }
}


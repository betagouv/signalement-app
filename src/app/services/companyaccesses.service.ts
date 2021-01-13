import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { CompanyAccess, PendingToken, UserAccess, WebsiteURL } from '../model/Company';
import { map, mergeMap } from 'rxjs/operators';
import { User } from '../model/AuthUser';
import { ApiCompanyToActivate } from '../api-sdk/model/Company';

import { parseISO } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class CompanyAccessesService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  myAccesses(user: User) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<UserAccess[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'accesses', 'connected-user']),
          headers
        );
      })
    );
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

  listPendingTokens(siret: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<PendingToken[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'accesses', siret, 'pending']),
          headers
        );
      })
    );
  }

  removePendingToken(siret: string, tokenId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.delete(
          this.serviceUtils.getUrl(Api.Report, ['api', 'accesses', siret, 'token', tokenId]),
          headers
        );
      })
    );
  }

  companiesToActivate() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<ApiCompanyToActivate[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'to-activate']),
          headers
        );
      }),
      map(results => results.map(result => ({
        company: {
          ...result.company,
          creationDate: parseISO(result.company.creationDate),
          website: result.company.website ? Object.assign(new WebsiteURL(), { url: result.company.website.url }) : undefined
        },
        lastNotice: result.lastNotice ? parseISO(result.lastNotice) : undefined,
        tokenCreation: parseISO(result.tokenCreation)
      })))
    );
  }

  downloadActivationDocuments(companyIds: Set<string>) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'activation-document']),
          { companyIds : Array.from(companyIds) },
          Object.assign(headers, {responseType: 'blob', observe: 'response' })
        );
      })
    );
  }

  confirmContactByPostOnCompaniesList(companyIds: Set<string>) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'companies', 'companies-posted']),
          { companyIds : Array.from(companyIds) },
          headers
        );
      })
    );
  }
}

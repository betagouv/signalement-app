import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './core/service.utils';
import { AuthenticationService } from './authentication.service';
import { map, mergeMap } from 'rxjs/operators';
import { User } from '../model/AuthUser';
import { PendingDGCCRF } from '../model/PendingDGCCRF';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils,
              private authenticationService: AuthenticationService) {

  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'account', 'password']),
          { oldPassword, newPassword},
          headers
        );
      })
    );
  }

  activateAccount(user: User, token: string, companySiret?: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'account', 'activation']),
          {
            draftUser: user,
            token: token,
            ...(companySiret ? {companySiret} : {})
          },
          headers
        );
      })
    );
  }

  getActivationDocumentUrl(siret: string) {
    return this.serviceUtils.getAuthHttpParam().pipe(
      map(param => {
        const url = this.serviceUtils.getUrl(Api.Report, ['api', 'account', siret, 'document', 'activation']);
        return `${url}?${param}`;
      })
    );
  }

  downloadActivationDocuments(reportuuids: Set<string>) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'account', 'document', 'activation']),
          { reportIds : Array.from(reportuuids) },
          Object.assign(headers, {responseType: 'blob', observe: 'response' })
        );
      })
    );
  }

  sendDGCCRFInvitation(email: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'account', 'dgccrf', 'invitation']),
          {email},
          headers
        );
      })
    );
  }
  listDGCCRFInvitations() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<PendingDGCCRF[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'account', 'dgccrf', 'pending']),
          headers
        );
      })
    );
  }
  listDGCCRFUsers() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<User[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'account', 'dgccrf', 'users']),
          headers
        );
      })
    );
  }
}

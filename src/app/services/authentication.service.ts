import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './core/service.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private serviceUtils: ServiceUtils,) {
  }

  readonly checkConsumerEmail = (email: string) => {
    return this.http.post<{valid: boolean}>(this.serviceUtils.getUrl(Api.Report, ['api', 'email', 'check']), { email });
  };

  readonly validateConsumerEmail = (email: string, confirmationCode: string) => {
    return this.http.post<{valid: boolean, reason?: 'TOO_MANY_ATTEMPTS' | 'INVALID_CODE'}>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'email', 'validate']),
      { email, confirmationCode }
    );
  };
}

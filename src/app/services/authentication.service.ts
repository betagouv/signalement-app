import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUser } from '../model/AuthUser';
import { Api, ServiceUtils } from './service.utils';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  login(email: string, password: string) {

    return this.http.post<AuthUser>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'authenticate']),
      JSON.stringify({ email, password }), this.serviceUtils.getHttpHeaders()
    )
      .pipe(
        map(authUser => {
          if (authUser.token) {
            return authUser.user;
          }
        })
      );
  }
}

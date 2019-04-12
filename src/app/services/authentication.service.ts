import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUser, User } from '../model/AuthUser';
import { Api, AuthUserStorageKey, ServiceUtils } from './service.utils';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSource = new BehaviorSubject<User>(undefined);
  user = this.userSource.asObservable();

  jwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils,
              private localStorage: LocalStorage) {
    this.localStorage.getItem(AuthUserStorageKey).subscribe(authUser => {
      if (authUser && authUser.token && !this.jwtHelperService.isTokenExpired(authUser.token)) {
        this.userSource.next(authUser);
      }
    });
  }

  login(email: string, password: string) {

    return this.http.post<AuthUser>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'authenticate']),
      JSON.stringify({ email, password }), this.serviceUtils.getHttpHeaders()
    )
    .pipe(
      map(authUser => {
        if (authUser.token) {
          this.userSource.next(authUser.user);
          this.localStorage.setItemSubscribe(AuthUserStorageKey, authUser);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  logout() {
    this.localStorage.removeItemSubscribe(AuthUserStorageKey);
    this.userSource.next(undefined);
  }

  isAuthenticated() {
    return this.localStorage.getItem(AuthUserStorageKey).subscribe(authUser => {
      return authUser && authUser.token && !this.jwtHelperService.isTokenExpired(authUser.token);
    });
  }
}

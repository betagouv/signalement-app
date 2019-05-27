import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthUser, User } from '../model/AuthUser';
import { Api, AuthUserStorageKey, ServiceUtils } from './service.utils';
import { map, mergeMap } from 'rxjs/operators';
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
        this.userSource.next(authUser.user);
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
          return authUser.user;
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
    return this.localStorage.getItem(AuthUserStorageKey)
    .pipe(
      map(authUser => authUser && authUser.token && !this.jwtHelperService.isTokenExpired(authUser.token))
    );
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'password']),
          { oldPassword, newPassword},
          headers
        );
      })
    );
  }
}

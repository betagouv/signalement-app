import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthUser, TokenInfo, User } from '../model/AuthUser';
import { Api, AuthUserStorageKey, ServiceUtils, TokenInfoStorageKey } from './service.utils';
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

  async getStoredTokenInfo() {
    return this.localStorage.getItem(TokenInfoStorageKey).toPromise().then(tokenInfo => {
        const minTimestamp = new Date();
        minTimestamp.setHours(minTimestamp.getHours() - 1);
        if (tokenInfo && tokenInfo.timestamp > minTimestamp) {
          return tokenInfo;
        } else {
          console.log("No TokenInfo, or expired");
          return null;
        }
    });
  }

  login(login: string, password: string) {
    return this.http.post<AuthUser>(
      this.serviceUtils.getUrl(Api.Report, ['api', 'authenticate']),
      JSON.stringify({ login, password }), this.serviceUtils.getHttpHeaders()
    )
    .pipe(
      map(authUser => {
        if (authUser.token) {
          this.userSource.next(authUser.user);
          this.localStorage.setItemSubscribe(AuthUserStorageKey, authUser);
          return authUser.user;
        } else {
          throw Error('Unauthenticated');
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

  forgotPassword(login: string) {
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'authenticate', 'password', 'forgot']),
      { login },
      this.serviceUtils.getHttpHeaders()
    );
  }

  resetPassword(password: string, authToken: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('token', encodeURIComponent(authToken));
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'authenticate', 'password', 'reset']),
      { password },
      Object.assign(this.serviceUtils.getHttpHeaders(), { params: httpParams })
    );
  }

  fetchTokenInfo(token: string) {
    return this.fetchTokenInfoImpl(['api', 'account', 'token'], token);
  }

  fetchCompanyTokenInfo(siret: string, token: string) {
    return this.fetchTokenInfoImpl(['api', 'accesses', siret, 'token'], token);
  }

  private fetchTokenInfoImpl(path: string[], token: string) {
    return this.http.get<TokenInfo>(
      this.serviceUtils.getUrl(Api.Report, path),
      {
        params:
          new HttpParams()
            .set('token', token),
        ...this.serviceUtils.getHttpHeaders()
      }
    )
    .pipe(
      map(data => {
        if (data) {
          const tokenInfo = <TokenInfo>Object.assign({timestamp: new Date()}, data);
          this.localStorage.setItemSubscribe(TokenInfoStorageKey, tokenInfo);
          return tokenInfo;
        } else {
          throw Error('Token invalide');
        }
      })
    );
  }

  acceptToken(siret: string, token: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post(
          this.serviceUtils.getUrl(Api.Report, ['api', 'accesses', siret, 'token', 'accept']),
          { token },
          headers
        );
      }),
    );
  }
}

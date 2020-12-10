import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map } from 'rxjs/operators';
import { ApiSdk } from '../api-sdk/ApiSdk';
import { ApiClient } from '../api-sdk/ApiClient';
import { ApiSdkSecured } from '../api-sdk/ApiSdkSecured';

export const AuthUserStorageKey = 'AuthUserSignalConso';
export const TokenInfoStorageKey = 'TokenInfoSignalConso';

@Injectable({
  providedIn: 'root'
})
export class ServiceUtils {

  constructor(private localStorage: LocalStorage) {
  }


  getUrl(api: Api, urlParams: string[]) {
    urlParams = urlParams.map(p => encodeURIComponent(p));
    return urlParams.reduce((acc, param) => `${acc}/${param}`, environment[api]);
  }

  getHttpHeaders() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    };
  }

  getAuthHeaders() {
    return this.localStorage.getItem(AuthUserStorageKey).pipe(
      map(authUser => {
        const httpHeaders = this.getHttpHeaders();
        if (authUser) {
          Object.assign(httpHeaders.headers, { 'X-Auth-Token': authUser.token });
        }
        return httpHeaders;
      })
    );
  }

  readonly getSecuredReportApiSdk = this.getAuthHeaders().pipe(map(headers => {
    const httpClient = new ApiClient({ headers: headers.headers, baseUrl: environment[Api.Report] + '/api' });
    return new ApiSdkSecured(httpClient);
  }));

  readonly getReportApiSdk = new ApiSdk(new ApiClient({ baseUrl: environment[Api.Report] + '/api' }));

  getAuthHttpParam() {
    return this.localStorage.getItem(AuthUserStorageKey).pipe(
      map(authUser => {
        let param = 'X-Auth-Token';
        if (authUser) {
          param = `${param}=${authUser.token}`;
        }
        return param;
      })
    );
  }

  objectToHttpParams<T extends object>(obj: T): { [key in keyof T]: string | string[] } {
    return Object.entries(obj).reduce((acc, [key, _]) => ({
      ...acc,
      ...((_ !== undefined && _ !== null) ?
        Array.isArray(_)
          ? { [key]: _.map(item => `${item}`.trim()) }
          : { [key]: `${_}`.trim() }
        : {})
    }), {}) as { [key in keyof T]: string | string[] };
  }

}


export enum Api {
  Report = 'apiReportBaseUrl',
  Company = 'apiCompanyBaseUrl',
  Address = 'apiAddressBaseUrl'
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map } from 'rxjs/operators';

export const AuthUserStorageKey = 'AuthUserSignalConso';

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
          Object.assign(httpHeaders.headers, { 'X-Auth-Token': authUser.token});
        }
        return httpHeaders;
      })
    );
  }

}


export enum Api {
  Report = 'apiReportBaseUrl',
  Company = 'apiCompanyBaseUrl',
  Address = 'apiAddressBaseUrl'
}

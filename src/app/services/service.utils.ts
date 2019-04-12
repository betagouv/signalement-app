import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LocalStorageDatabase } from '@ngx-pwa/local-storage';

export const AuthUserStorageKey = 'AuthUserSignalConso';

@Injectable({
  providedIn: 'root'
})
export class ServiceUtils {

  constructor(private localStorage: LocalStorageDatabase) {
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
    return this.localStorage.getItem(AuthUserStorageKey).subscribe(authUser => {
      if (authUser) {
        const httpHeaders = { 'X-Auth-Token': authUser.token };
        httpHeaders['Content-Type'] = 'application/json';
        httpHeaders['Accept'] = 'application/json';
        return httpHeaders;
      }
    });
  }

}


export enum Api {
  Report = 'apiReportBaseUrl',
  Company = 'apiCompanyBaseUrl',
  Address = 'apiAddressBaseUrl'
}

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export const AuthUserStorageKey = 'AuthUserSignalConso';
export const TokenInfoStorageKey = 'TokenInfoSignalConso';

@Injectable({
  providedIn: 'root'
})
export class ServiceUtils {

  constructor() {
  }

  getUrl(api: Api, urlParams: string[]) {
    urlParams = urlParams.map(p => encodeURIComponent(p));
    return urlParams.reduce((acc, param) => `${acc}/${param}`, environment[api]);
  }
}


export enum Api {
  Report = 'apiReportBaseUrl',
  Company = 'apiCompanyBaseUrl',
  Address = 'apiAddressBaseUrl'
}

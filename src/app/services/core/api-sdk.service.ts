import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ApiSecuredSdk } from '../../api-sdk/ApiSecuredSdk';
import { ApiClient, RequestOption } from '../../api-sdk/ApiClient';
import { environment } from '../../../environments/environment';
import { ApiPublicSdk } from '../../api-sdk/ApiPublicSdk';
import { Api, AuthUserStorageKey } from './service.utils';

@Injectable({
  providedIn: 'root'
})
export class ApiSdkService {

  constructor(private localStorage: LocalStorage) {
  }

  private readonly commonHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  readonly unsecured = new ApiPublicSdk(new ApiClient({
    headers: this.commonHeaders,
    baseUrl: environment[Api.Report] + '/api'
  }));
}

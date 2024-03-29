import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ApiClient, SignalConsoPublicSdk } from '@signal-conso/signalconso-api-sdk-js';
import { environment } from '../../../environments/environment';
import { Api } from './service.utils';

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

  readonly unsecured = new SignalConsoPublicSdk(new ApiClient({
    headers: this.commonHeaders,
    baseUrl: environment[Api.Report] + '/api'
  }));
}

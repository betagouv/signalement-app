import { Injectable } from '@angular/core';
import { SignalConsoSecuredSdk } from '@signal-conso/signalconso-api-sdk-js';
import { SignalConsoPublicSdk } from '@signal-conso/signalconso-api-sdk-js';
import { ApiClientMock } from '@signal-conso/signalconso-api-sdk-js';
import { environment } from '../../../environments/environment';
import { Api } from './service.utils';

@Injectable({
  providedIn: 'root'
})
export class ApiSdkMockService {

  private readonly commonHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  readonly apiClient = new ApiClientMock({
    headers: this.commonHeaders,
    baseUrl: environment[Api.Report] + '/api'
  });

  readonly secured = new SignalConsoSecuredSdk(this.apiClient);

  readonly unsecured = new SignalConsoPublicSdk(this.apiClient);
}

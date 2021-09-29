import { Injectable } from '@angular/core';
import { ApiSecuredSdk } from '@betagouv/signalconso-api-sdk-js';
import { ApiPublicSdk } from '@betagouv/signalconso-api-sdk-js';
import { ApiClientMock } from '@betagouv/signalconso-api-sdk-js';
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

  readonly secured = new ApiSecuredSdk(this.apiClient);

  readonly unsecured = new ApiPublicSdk(this.apiClient);
}

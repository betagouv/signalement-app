import { Injectable } from '@angular/core';
import { ApiSecuredSdk } from '../../api-sdk/ApiSecuredSdk';
import { ApiPublicSdk } from '../../api-sdk/ApiPublicSdk';
import { ApiClientMock } from '../../api-sdk/ApiClientMock';
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceUtils } from './service.utils';
import { mergeMap } from 'rxjs/operators';
import { ApiError } from '../api-sdk/ApiClient';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  constructor(private http: HttpClient,
    private serviceUtils: ServiceUtils) {
  }

  readonly getReportStatusList = () => this.serviceUtils.getSecuredReportApiSdk.pipe(
    mergeMap(api => api.constant.getReportStatusList())
  );

  private _fetchingCountries = false;
  get fetchingCountries() {
    return this._fetchingCountries;
  }

  private _fetchCountriesError?: ApiError;
  get fetchCountriesError() {
    return this._fetchCountriesError;
  }

  readonly getCountries = () => this.serviceUtils.getReportApiSdk.getCountries();
}

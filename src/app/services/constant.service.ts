import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceUtils } from './service.utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ApiError } from '../api-sdk/ApiClient';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Country } from '../model/Country';

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

  protected source = new BehaviorSubject<Country[] | undefined>(undefined);

  private _fetchingCountries = false;
  get fetchingCountries() {
    return this._fetchingCountries;
  }

  private _fetchCountriesError?: ApiError;
  get fetchCountriesError() {
    return this._fetchCountriesError;
  }

  readonly getCountries = () => new Observable(_ => _.next()).pipe(
    map(_ => {
      // To prevent the damned ExpressionChangedAfterItHasBeenCheckedError
      // https://github.com/angular/angular/issues/17572
      setTimeout(() => this._fetchingCountries = true);
      this._fetchCountriesError = undefined;
      return _;
    }),
    mergeMap(this.serviceUtils.getReportApiSdk.getCountries),
    mergeMap((countries: Country[]) => {
      this._fetchingCountries = false;
      this.source.next(countries);
      return this.source.asObservable() as Observable<Country[]>;
    }),
    catchError((err: ApiError) => {
      this._fetchingCountries = false;
      this._fetchCountriesError = err;
      return throwError(err);
    }),
  );

}

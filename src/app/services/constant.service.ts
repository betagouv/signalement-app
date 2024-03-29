import { Injectable } from '@angular/core';
import { ApiSdkService } from './core/api-sdk.service';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { ApiError } from '@signal-conso/signalconso-api-sdk-js';
import { BehaviorSubject, iif, Observable, of, throwError } from 'rxjs';
import { Country } from '../model/Country';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  constructor(private apiSdk: ApiSdkService,) {
  }

  protected source = new BehaviorSubject<Country[] | undefined>(undefined);

  private _fetchingCountries = false;
  get fetchingCountries() {
    return this._fetchingCountries;
  }

  private _fetchCountriesError?: ApiError;
  get fetchCountriesError() {
    return this._fetchCountriesError;
  }

  readonly getCountries = () => iif(() => this.source.value !== undefined,
    this.source.asObservable() as Observable<Country[]>,
    of((_: any) => _.next()).pipe(
      tap(_ => {
        // To prevent the damned ExpressionChangedAfterItHasBeenCheckedError
        // https://github.com/angular/angular/issues/17572
        setTimeout(() => this._fetchingCountries = true);
        this._fetchCountriesError = undefined;
      }),
      mergeMap(this.apiSdk.unsecured.constant.getCountries),
      mergeMap((countries: Country[]) => {
        setTimeout(() => this._fetchingCountries = false);
        this.source.next(countries);
        return this.source.asObservable() as Observable<Country[]>;
      }),
      catchError((err: ApiError) => {
        setTimeout(() => this._fetchingCountries = false);
        this._fetchCountriesError = err;
        return throwError(err);
      }),
    )
  );
}

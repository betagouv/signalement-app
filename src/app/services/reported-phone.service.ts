import { Injectable } from '@angular/core';
import { ServiceUtils } from './service.utils';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiError } from '../api-sdk/ApiClient';
import { PhoneWithReportCount } from '../model/ReportedPhone';
import format from 'date-fns/format';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportedPhoneService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  protected source = new BehaviorSubject<PhoneWithReportCount[] | undefined>(undefined);

  private _fetching = false;
  get fetching() {
    return this._fetching;
  }

  private _fetchError?: ApiError;
  get fetchError() {
    return this._fetchError;
  }

  readonly fetch = (q?: string, start?: Date, end?: Date): Observable<PhoneWithReportCount[]> => {
    return this.serviceUtils.getSecuredReportApiSdk.pipe(
      tap(_ => {
        this._fetching = true;
        this._fetchError = undefined;
      }),
      mergeMap(api => api.reportedPhone.list(
        q,
        start ? format(start, 'yyyy-MM-dd') : null,
        end ? format(end, 'yyyy-MM-dd') : null)
      ),
      tap(r => {
        this._fetching = false;
        this.source.next(r);
      }),
      mergeMap(_ => this.source.asObservable()),
      catchError((err: ApiError) => {
        this._fetching = false;
        this._fetchError = err;
        return throwError(err);
      })
    );
  }


  readonly extract = (q?: string, start?: Date, end?: Date): Observable<PhoneWithReportCount[]> => {
    return this.serviceUtils.getSecuredReportApiSdk.pipe(
      mergeMap(api => api.reportedPhone.extract(
        q,
        start ? format(start, 'yyyy-MM-dd') : null,
        end ? format(end, 'yyyy-MM-dd') : null)
      )
    );
  }
}

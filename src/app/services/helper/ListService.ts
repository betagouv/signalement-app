import { Entity } from '../../api-sdk/model/Common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiSdkService } from '../core/api-sdk.service';
import { ApiError } from '../../api-sdk/ApiClient';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

export abstract class ListService<T extends Entity> {

  constructor(
    protected api: ApiSdkService,
    protected listMethod: (...args: any[]) => Observable<T[]> | Promise<T[]>) {
  }

  protected source = new BehaviorSubject<T[] | undefined>(undefined);

  protected _fetching = false;
  get fetching() {
    return this._fetching;
  }

  protected _fetchError?: ApiError;
  get fetchError() {
    return this._fetchError;
  }

  readonly list = ({ force = true, clean = true }: {force?: boolean, clean?: boolean} = {}, ...args: any[]): Observable<T[]> => {
    if (this.source.value && !force) {
      return this.source.asObservable() as Observable<T[]>;
    }
    if (clean) {
      this.source.next(undefined);
    }
    return new Observable(_ => _.next()).pipe(
      tap(_ => {
        this._fetching = true;
        this._fetchError = undefined;
      }),
      mergeMap(() => this.listMethod(...args)),
      mergeMap((data: T[]) => {
        this._fetching = false;
        this.source.next(data);
        return this.source.asObservable() as Observable<T[]>;
      }),
      catchError((err: ApiError) => {
        this._fetching = false;
        this._fetchError = err;
        return throwError(err);
      }),
    );
  };
}

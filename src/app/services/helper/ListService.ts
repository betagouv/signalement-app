import { Entity } from '../../api-sdk/model/Common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ServiceUtils } from '../service.utils';
import { ApiError } from '../../api-sdk/ApiClient';
import { catchError, map, mergeMap } from 'rxjs/operators';

export abstract class ListService<T extends Entity> {

  constructor(
    protected utils: ServiceUtils,
    protected listMethod: () => Observable<T[]>) {
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

  readonly list = ({ force = true, clean = true }: {force?: boolean, clean?: boolean} = {}): Observable<T[]> => {
    if (this.source.value && !force) {
      return this.source.asObservable() as Observable<T[]>;
    }
    if (clean) {
      this.source.next(undefined);
    }
    return this.listMethod().pipe(
      map(_ => {
        this._fetching = true;
        this._fetchError = undefined;
        return _;
      }),
      mergeMap((websites: T[]) => {
        this._fetching = false;
        this.source.next(websites);
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

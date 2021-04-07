import { Entity, Id } from '../../api-sdk/model/Common';
import { Observable, throwError } from 'rxjs';
import { ApiSdkService } from '../core/api-sdk.service';
import { ApiError } from '../../api-sdk/ApiClient';
import { Index } from '../../model/Common';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FetchService } from './FetchService';

interface CRUDListMethods<T extends Entity, C = Partial<T>, U = Partial<T>> {
  list: (...args: any[]) => Observable<T[]> | Promise<T[]>;
  create?: (c: C) => Observable<T> | Promise<T>;
  update?: (id: Id, u: U) => Observable<T> | Promise<T>;
  remove?: (id: Id) => Observable<void> | Promise<void>;
}

export class CRUDListServiceNotImplementedError extends Error {
  constructor(method: string) {
    super(`[CRUDService] Method ${method} not implemented.`);
  }
}

export abstract class CRUDListService<T extends Entity, C = Partial<T>, U = Partial<T>> extends FetchService<T[]> {

  constructor(
    protected api: ApiSdkService,
    protected methods: CRUDListMethods<T, C, U>) {
    super(api, methods.list);
  }

  protected _creating = false;
  get creating() {
    return this._creating;
  }

  protected _creatingError?: ApiError;
  get creatingError() {
    return this._creatingError;
  }

  protected _updating = new Set<string>();
  readonly updating = (id: Id) => this._updating.has(id);

  protected _updateError: Index<ApiError> = {};
  readonly updateError = (id: Id): ApiError => this._updateError[id];

  protected _removing = new Set<string>();
  readonly removing = (id: Id) => this._removing.has(id);

  protected _removeError: Index<ApiError> = {};
  readonly removeError = (id: Id): ApiError => this._removeError[id];

  readonly create = (data: C, { insert = true, insertBefore = false }: {insert?: boolean, insertBefore?: boolean} = {}): Observable<T> => {
    if (!this.methods.create) {
      throw new CRUDListServiceNotImplementedError(`create`);
    }
    return new Observable(_ => _.next()).pipe(
      map(_ => {
        this._creating = true;
        this._creatingError = undefined;
        return _;
      }),
      mergeMap(() => this.methods.create!(data)),
      map((created => {
        this._creating = false;
        if (insert) {
          this.source.next(insertBefore
            ? [created, ...(this.source.value ?? [])]
            : [...(this.source.value ?? []), created]
          );
        }
        return created;
      })),
      catchError((err: ApiError) => {
        this._creating = false;
        this._creatingError = err;
        return throwError(err);
      }),
    );
  };

  readonly update = (id: Id, data: U): Observable<T> => {
    if (!this.methods.update) {
      throw new CRUDListServiceNotImplementedError(`update`);
    }
    return new Observable(_ => _.next()).pipe(
      map(_ => {
        this._updating.add(id);
        delete this._updateError[id];
        return _;
      }),
      mergeMap(() => this.methods.update!(id, data)),
      map((updated: T) => {
        this.source.next((this.source.value ?? []).map((_: T) => _.id === id ? updated : _));
        this._updating.delete(id);
        return updated;
      }),
      catchError((err: ApiError) => {
        this._updating.delete(id);
        this._updateError[id] = err;
        return throwError(err);
      }),
    );
  };

  readonly remove = (id: Id): Observable<void> => {
    if (!this.methods.remove) {
      throw new CRUDListServiceNotImplementedError(`remove`);
    }
    return new Observable(_ => _.next()).pipe(
      map(_ => {
        this._removing.add(id);
        delete this._removeError[id];
        return _;
      }),
      mergeMap(() => this.methods.remove!(id)),
      map(() => {
        this.source.next((this.source.value ?? []).filter((_: T) => _.id !== id));
        this._removing.delete(id);
      }),
      catchError((err: ApiError) => {
        this._removing.delete(id);
        this._removeError[id] = err;
        return throwError(err);
      }),
    );
  };

  readonly get = (id: Id): T | undefined => this.source.value?.find(_ => _.id === id);
}

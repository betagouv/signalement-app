import { Entity, Id } from '../../api-sdk/model/Common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ServiceUtils } from '../service.utils';
import { ApiError } from '../../api-sdk/ApiClient';
import { Index } from '../../model/Common';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ListService } from './ListService';

interface CRUDListMethods<T extends Entity, C = Partial<T>, U = Partial<T>> {
  list: (...args: any[]) => Observable<T[]>;
  create?: (c: C) => Observable<T>;
  update?: (id: Id, u: U) => Observable<T>;
  remove?: (id: Id) => Observable<void>;
}

export class CRUDListServiceNotImplementedError extends Error {
  constructor(method: string) {
    super(`[CRUDService] Method ${method} not implemented.`);
  }
}

export abstract class CRUDListService<T extends Entity, C, U> extends ListService<T> {

  constructor(
    protected utils: ServiceUtils,
    protected methods: CRUDListMethods<T, C, U>) {
    super(utils, methods.list);
  }

  protected source = new BehaviorSubject<T[] | undefined>(undefined);

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

  readonly create = (data: C): Observable<T> => {
    if (!this.methods.create) {
      throw new CRUDListServiceNotImplementedError(`create`);
    }
    return new Observable(_ => _.next()).pipe(
      map(_ => {
        this._creating = true;
        this._creatingError = undefined;
        return _;
      }),
      mergeMap(() => this.methods.create(data)),
      map((createdWebsite => {
        this._creating = false;
        this.source.next([...(this.source.value ?? []), createdWebsite]);
        return createdWebsite;
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
      mergeMap(() => this.methods.update(id, data)),
      map((updatedWebsite: T) => {
        this.source.next((this.source.value ?? []).map((_: T) => _.id === id ? updatedWebsite : _));
        this._updating.delete(id);
        return updatedWebsite;
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
      mergeMap(() => this.methods.remove(id)),
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
}

import { Entity, Id } from '../api-sdk/model/Common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiError } from '../api-sdk/ApiClient';
import { Index } from '../model/Common';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export interface Read<E> {
  fetching: boolean;
  readonly list: ({ force, clean }: {force?: boolean, clean?: boolean}) => Observable<E[]>;
}

export interface Remove<E> {
  removing: (id: Id) => boolean;
  updateError: (id: Id) => ApiError;
  remove: (id: Id) => Observable<void>;
}

export interface Update<E, U> {
  updating: (id: Id) => boolean;
  updateError: (id: Id) => ApiError;
  update: (id: Id, u: U) => Observable<E>;
}

export interface Create<E, C> {
  creating: boolean;
  creatingError: ApiError;
  create: (u: C) => Observable<E>;
}

type ReadAction<T> = (...args: any[]) => Observable<T>;
type CreateAction<T> = (...args: any[]) => Observable<T>;
type UpdateAction<T> = (id: Id, ...args: any[]) => Observable<T>;
type DeleteAction = (id: Id) => Observable<void>;

export type CrudListR<E extends Entity> = Read<E>;
export type CrudListRD<E extends Entity> = Read<E> & Remove<E>;
export type CrudListCRD<E extends Entity, C = Partial<E>> = Create<E, C> & Read<E> & Remove<E>;
export type CrudListCRUD<E extends Entity, C = Partial<E>, U = Partial<E>> = Create<E, C> & Read<E> & Remove<E> & Update<E, U>;
export type CrudListCR<E extends Entity, C = Partial<E>> = Create<E, C> & Read<E>;
export type CrudListC<E extends Entity, C = Partial<E>> = Create<E, C>;
export type CrudListD<E extends Entity> = Remove<E>;
export type CrudListCUD<E extends Entity, C = Partial<E>, U = Partial<E>> = Create<E, C> & Remove<E> & Update<E, U>;
export type CrudListCD<E extends Entity, C = Partial<E>> = Create<E, C> & Remove<E>;

export interface CrudList {
  <E extends Entity>(_: {fetch: ReadAction<E[]>}): CrudListR<E>;
  <E extends Entity>(_: {fetch: ReadAction<E[]>, create: CreateAction<E>,}): CrudListCR<E>;
  <E extends Entity>(_: {fetch: ReadAction<E[]>, remove: DeleteAction}): CrudListRD<E>;
  <E extends Entity>(_: {fetch: ReadAction<E[]>, create: CreateAction<E>, update: UpdateAction<E>, remove: DeleteAction}): CrudListCRUD<E>;
  <E extends Entity>(_: {fetch: ReadAction<E[]>, create: CreateAction<E>, remove: DeleteAction}): CrudListCRD<E>;
  <E extends Entity>(_: {create: CreateAction<E>,}): CrudListC<E>;
  <E extends Entity>(_: {remove: DeleteAction}): CrudListD<E>;
  <E extends Entity>(_: {create: CreateAction<E>, update: UpdateAction<E>, remove: DeleteAction}): CrudListCUD<E>;
  <E extends Entity>(_: {create: CreateAction<E>, remove: DeleteAction}): CrudListCD<E>;
}

interface CRUDListMethods<T extends Entity, C = Partial<T>, U = Partial<T>> {
  create?: (c: C) => Observable<T>;
  fetch?: () => Observable<T[]>;
  update?: (id: Id, u: U) => Observable<T>;
  remove?: (id: Id) => Observable<void>;
}

export class CRUDListServiceNotImplementedError extends Error {
  constructor(method: string) {
    super(`[CRUDService] Method ${method} not implemented.`);
  }
}

export const CRUDListService: any = Injectable()(<T extends Entity, C, U>(methods: CRUDListMethods<T, C, U>) => {

  const source = new BehaviorSubject<T[] | undefined>(undefined);

  let _creating = false;
  const creating = () => _creating;

  let _creatingError: ApiError | undefined;
  const creatingError = () => _creatingError;

  let _fetching = false;
  const fetching = () => _fetching;

  let _fetchError: ApiError | undefined;
  const fetchError = () => _fetchError;

  const _updating = new Set<string>();
  const updating = (id: Id) => _updating.has(id);

  const _updateError: Index<ApiError> = {};
  const updateError = (id: Id): ApiError => _updateError[id];

  const _removing = new Set<string>();
  const removing = (id: Id) => _removing.has(id);

  const _removeError: Index<ApiError> = {};
  const removeError = (id: Id): ApiError => _removeError[id];

  const create = (data: C): Observable<T> => {
    if (!methods.create) {
      throw new CRUDListServiceNotImplementedError(`create`);
    }

    return new Observable(_ => _.next()).pipe(
      map(_ => {
        _creating = true;
        _creatingError = undefined;
        return _;
      }),
      mergeMap(() => methods.create(data)),
      map((createdWebsite => {
        _creating = false;
        source.next([...(source.value ?? []), createdWebsite]);
        return createdWebsite;
      })),
      catchError((err: ApiError) => {
        _creating = false;
        _creatingError = err;
        return throwError(err);
      }),
    );
  };

  const list = ({ force = true, clean = true }: {force?: boolean, clean?: boolean} = {}): Observable<T[]> => {
    if (!methods.fetch) {
      throw new CRUDListServiceNotImplementedError(`list`);
    }
    if (source.value && !force) {
      return source.asObservable() as Observable<T[]>;
    }
    if (clean) {
      source.next(undefined);
    }
    return methods.fetch().pipe(
      map(_ => {
        _fetching = true;
        _fetchError = undefined;
        return _;
      }),
      mergeMap((websites: T[]) => {
        _fetching = false;
        source.next(websites);
        return source.asObservable() as Observable<T[]>;
      }),
      catchError((err: ApiError) => {
        _fetching = false;
        _fetchError = err;
        return throwError(err);
      }),
    );
  };

  const update = (id: Id, data: U): Observable<T> => {
    if (!methods.update) {
      throw new CRUDListServiceNotImplementedError(`update`);
    }
    return new Observable(_ => _.next()).pipe(
      map(_ => {
        _updating.add(id);
        delete _updateError[id];
        return _;
      }),
      mergeMap(() => methods.update(id, data)),
      map((updatedWebsite: T) => {
        source.next((source.value ?? []).map((_: T) => _.id === id ? updatedWebsite : _));
        _updating.delete(id);
        return updatedWebsite;
      }),
      catchError((err: ApiError) => {
        _updating.delete(id);
        _updateError[id] = err;
        return throwError(err);
      }),
    );
  };

  const remove = (id: Id): Observable<void> => {
    if (!methods.remove) {
      throw new CRUDListServiceNotImplementedError(`remove`);
    }
    return new Observable(_ => _.next()).pipe(
      map(_ => {
        _removing.add(id);
        delete _removeError[id];
        return _;
      }),
      mergeMap(() => methods.remove(id)),
      map(() => {
        source.next((source.value ?? []).filter((_: T) => _.id !== id));
        _removing.delete(id);
      }),
      catchError((err: ApiError) => {
        _removing.delete(id);
        _removeError[id] = err;
        return throwError(err);
      }),
    );
  };

  return {
    ...(methods.fetch && { list, fetching, fetchError }),
    ...(methods.remove && { removing, removeError, remove, }),
    ...(methods.update && { updating, updateError, update, }),
    ...(methods.create && { creating, creatingError, create, })
  } as any;
});



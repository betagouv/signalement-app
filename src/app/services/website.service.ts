import { Injectable } from '@angular/core';
import { ServiceUtils } from './service.utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiWebsite, ApiWebsiteCreate, ApiWebsiteUpdateCompany, ApiWebsiteWithCompany } from '../api-sdk/model/ApiWebsite';
import { Id } from '../api-sdk/model/Common';
import { ApiError } from '../api-sdk/ApiClient';
import { Index } from '../model/Common';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  constructor(
    private utils: ServiceUtils,
  ) {
  }

  private source = new BehaviorSubject<ApiWebsiteWithCompany[] | undefined>(undefined);

  private _creating = false;
  get creating() {
    return this._creating;
  }

  private _creatingError?: ApiError;
  get creatingError() {
    return this._creatingError;
  }

  private _fetching = false;
  get fetching() {
    return this._fetching;
  }

  private _fetchError?: ApiError;
  get fetchError() {
    return this._fetchError;
  }

  private _updating = new Set<string>();
  updating = (id: string) => this._updating.has(id);

  private _updateError: Index<ApiError> = {};
  updateError = (id: string): ApiError => this._updateError[id];

  private _updateCompanyError: Index<ApiError> = {};
  updateCompanyError = (id: string): ApiError => this._updateCompanyError[id];

  private _updatingCompany = new Set<string>();
  updatingCompany = (id: string) => this._updatingCompany.has(id);

  private _removing = new Set<string>();
  removing = (id: string) => this._removing.has(id);

  private _removeError: Index<ApiError> = {};
  removeError = (id: string): ApiError => this._removeError[id];

  readonly create = (website: ApiWebsiteCreate): Observable<ApiWebsiteWithCompany> => {
    this._creating = true;
    this._creatingError = undefined;
    return this.utils.getSecuredReportApiSdk.pipe(
      mergeMap(api => api.website.create(website)),
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

  readonly list = ({ force = true, clean = true }: {force?: boolean, clean?: boolean} = {}): Observable<ApiWebsiteWithCompany[]> => {
    if (this.source.value && !force) {
      return this.source.asObservable() as Observable<ApiWebsiteWithCompany[]>;
    }
    if (clean) {
      this.source.next(undefined);
    }
    return this.utils.getSecuredReportApiSdk.pipe(
      map(_ => {
        this._fetching = true;
        this._fetchError = undefined;
        return _;
      }),
      mergeMap(api => api.website.list()),
      mergeMap((websites: ApiWebsiteWithCompany[]) => {
        this._fetching = false;
        this.source.next(websites);
        return this.source.asObservable() as Observable<ApiWebsiteWithCompany[]>;
      }),
      catchError((err: ApiError) => {
        this._fetching = false;
        this._fetchError = err;
        return throwError(err);
      }),
    );
  }

  readonly update = (id: Id, website: Partial<ApiWebsite>): Observable<ApiWebsiteWithCompany> => {
    return this.utils.getSecuredReportApiSdk.pipe(
      map(_ => {
        this._updating.add(id);
        delete this._updateError[id];
        return _;
      }),
      mergeMap(api => api.website.update(id, website)),
      map((updatedWebsite: ApiWebsiteWithCompany) => {
        this.source.next((this.source.value ?? []).map((_: ApiWebsiteWithCompany) => _.id === id ? updatedWebsite : _));
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

  readonly updateCompany = (id: Id, website: ApiWebsiteUpdateCompany): Observable<ApiWebsiteWithCompany> => {
    return this.utils.getSecuredReportApiSdk.pipe(
      map(_ => {
        this._updatingCompany.add(id);
        delete this._updateCompanyError[id];
        return _;
      }),
      mergeMap(api => api.website.updateCompany(id, website)),
      map((updatedWebsite: ApiWebsiteWithCompany) => {
        this.source.next((this.source.value ?? []).map((_: ApiWebsiteWithCompany) => _.id === id ? updatedWebsite : _));
        this._updatingCompany.delete(id);
        return updatedWebsite;
      }),
      catchError((err: ApiError) => {
        this._updatingCompany.delete(id);
        this._updateCompanyError[id] = err;
        return throwError(err);
      }),
    );
  };

  readonly remove = (id: Id): Observable<void> => {
    return this.utils.getSecuredReportApiSdk.pipe(
      map(_ => {
        this._removing.add(id);
        delete this._removeError[id];
        return _;
      }),
      mergeMap(api => api.website.remove(id)),
      map(() => {
        this.source.next((this.source.value ?? []).filter((_: ApiWebsiteWithCompany) => _.id !== id));
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

import { Injectable } from '@angular/core';
import { ServiceUtils } from './service.utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiWebsite, ApiWebsiteCreate, ApiWebsiteUpdateCompany, ApiWebsiteWithCompany } from '../api-sdk/model/ApiWebsite';
import { Id } from '../api-sdk/model/Common';

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

  private _creatingError = false;
  get creatingError() {
    return this._creatingError;
  }

  private _fetching = false;
  get fetching() {
    return this._fetching;
  }

  private _fetchError = false;
  get fetchError() {
    return this._fetchError;
  }

  private _updating = new Set<string>();
  updating = (id: string) => {
    return this._updating.has(id);
  };

  private _updateError = new Set<string>();
  updateError = (id: string) => {
    return this._updateError.has(id);
  };


  private _deleting = new Set<string>();
  deleting = (id: string) => {
    return this._deleting.has(id);
  };

  private _deleteError = new Set<string>();
  deleteError = (id: string) => {
    return this._deleteError.has(id);
  };

  readonly create = (website: ApiWebsiteCreate): Observable<ApiWebsiteWithCompany> => {
    this._creating = true;
    this._creatingError = false;
    return this.utils.getReportApiSdk().pipe(
      mergeMap(api => api.website.create(website)),
      map((createdWebsite => {
        this._creating = false;
        this.source.next([...(this.source.value ?? []), createdWebsite]);
        return createdWebsite;
      })),
      catchError(err => {
        console.error(err);
        this._creating = false;
        this._creatingError = true;
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
    this._fetching = true;
    this._fetchError = false;
    return this.utils.getReportApiSdk().pipe(
      mergeMap(api => api.website.list()),
      mergeMap((websites: ApiWebsiteWithCompany[]) => {
        this._fetching = false;
        this.source.next(websites);
        return this.source.asObservable() as Observable<ApiWebsiteWithCompany[]>;
      }),
      catchError(err => {
        console.error(err);
        this._fetching = false;
        this._fetchError = true;
        return throwError(err);
      }),
    );
  }

  readonly update = (id: Id, website: Partial<ApiWebsite>): Observable<ApiWebsiteWithCompany> => {
    this._updating.add(id);
    this._updateError.delete(id);
    return this.utils.getReportApiSdk().pipe(
      mergeMap(api => api.website.update(id, website)),
      map((updatedWebsite: ApiWebsiteWithCompany) => {
        this.source.next((this.source.value ?? []).map((_: ApiWebsiteWithCompany) => _.id === id ? updatedWebsite : _));
        this._updating.delete(id);
        return updatedWebsite;
      }),
      catchError(err => {
        console.error(err);
        this._updating.delete(id);
        this._updateError.add(id);
        return throwError(err);
      }),
    );
  };

  readonly updateCompany = (id: Id, website: ApiWebsiteUpdateCompany): Observable<ApiWebsiteWithCompany> => {
    this._updating.add(id);
    this._updateError.delete(id);
    return this.utils.getReportApiSdk().pipe(
      mergeMap(api => api.website.updateCompany(id, website)),
      map((updatedWebsite: ApiWebsiteWithCompany) => {
        this.source.next((this.source.value ?? []).map((_: ApiWebsiteWithCompany) => _.id === id ? updatedWebsite : _));
        this._updating.delete(id);
        return updatedWebsite;
      }),
      catchError(err => {
        console.error(err);
        this._updating.delete(id);
        this._updateError.add(id);
        return throwError(err);
      }),
    );
  };

  readonly remove = (id: Id): Observable<void> => {
    this._deleting.add(id);
    this._deleteError.delete(id);
    return this.utils.getReportApiSdk().pipe(
      mergeMap(api => api.website.remove(id)),
      map(() => {
        this.source.next((this.source.value ?? []).filter((_: ApiWebsiteWithCompany) => _.id !== id));
        this._deleting.delete(id);
      }),
      catchError(err => {
        console.error(err);
        this._deleting.delete(id);
        this._deleteError.add(id);
        return throwError(err);
      }),
    );
  };
}

import { Injectable } from '@angular/core';
import { ServiceUtils } from './service.utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiWebsite, ApiWebsiteWithCompany } from '../api-sdk/model/ApiWebsite';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  constructor(
    private utils: ServiceUtils,
  ) {
  }

  private source: BehaviorSubject<ApiWebsiteWithCompany[] | undefined> = new BehaviorSubject(undefined);

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

  list({ force = true, clean = true }: {force?: boolean, clean?: boolean} = {}): Observable<ApiWebsiteWithCompany[]> {
    if (this.source.value && !force) {
      return this.source.asObservable();
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
        return this.source.asObservable();
      }),
      catchError(err => {
        console.error(err);
        this._fetchError = true;
        return throwError(err);
      }),
    );
  }

  update(id: string, website: Partial<ApiWebsite>): Observable<ApiWebsiteWithCompany> {
    this._updating.add(id);
    this._updateError.delete(id);
    return this.utils.getReportApiSdk().pipe(
      mergeMap(api => api.website.update(id, website)),
      map((updatedWebsite: ApiWebsiteWithCompany) => {
        this.source.next(this.source.value.map((_: ApiWebsiteWithCompany) => _.id === id ? updatedWebsite : _));
        this._updating.delete(id);
        return updatedWebsite;
      }),
      catchError(err => {
        console.error(err);
        this._updateError.add(id);
        return throwError(err);
      }),
    );
  }
}

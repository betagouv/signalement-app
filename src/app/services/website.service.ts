import { Injectable } from '@angular/core';
import { ServiceUtils } from './service.utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ApiWebsite, ApiWebsiteCreate, ApiWebsiteUpdateCompany, ApiWebsiteWithCompany } from '../api-sdk/model/ApiWebsite';
import { Id } from '../api-sdk/model/Common';
import { ApiError } from '../api-sdk/ApiClient';
import { Index } from '../model/Common';
import { CRUDListService } from './CRUDListService';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService extends CRUDListService<ApiWebsiteWithCompany, ApiWebsiteCreate, Partial<ApiWebsite>> {

  constructor(protected utils: ServiceUtils,) {
    super(utils, {
      list: () => utils.getReportApiSdk().pipe(mergeMap(api => api.website.list())),
      create: (c: ApiWebsiteCreate) => utils.getReportApiSdk().pipe(mergeMap(api => api.website.create(c))),
      update: (id: Id, u: Partial<ApiWebsite>) => utils.getReportApiSdk().pipe(mergeMap(api => api.website.update(id, u))),
      remove: (id: Id) => utils.getReportApiSdk().pipe(mergeMap(api => api.website.remove(id))),
    });
  }

  private _updateCompanyError: Index<ApiError> = {};
  readonly updateCompanyError = (id: string): ApiError => this._updateCompanyError[id];

  private _updatingCompany = new Set<string>();
  readonly updatingCompany = (id: string) => this._updatingCompany.has(id);

  readonly updateCompany = (id: Id, website: ApiWebsiteUpdateCompany): Observable<ApiWebsiteWithCompany> => {
    return this.utils.getReportApiSdk().pipe(
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
}

import { Injectable } from '@angular/core';
import { ServiceUtils } from './service.utils';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiWebsite, ApiWebsiteCreate, ApiWebsiteUpdateCompany, ApiWebsiteWithCompany } from '../api-sdk/model/ApiWebsite';
import { Id } from '../api-sdk/model/Common';
import { ApiError } from '../api-sdk/ApiClient';
import { Index } from '../model/Common';
import { CRUDListService } from './helper/CRUDListService';
import { HostWithReportCount } from '../model/Website';
import format from 'date-fns/format';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService extends CRUDListService<ApiWebsiteWithCompany, ApiWebsiteCreate, Partial<ApiWebsite>> {

  constructor(protected utils: ServiceUtils) {
    super(utils, {
      list: () => utils.getSecuredReportApiSdk.pipe(mergeMap(api => api.website.list())),
      update: (id: Id, u: Partial<ApiWebsite>) => utils.getSecuredReportApiSdk.pipe(mergeMap(api => api.website.update(id, u))),
      remove: (id: Id) => utils.getSecuredReportApiSdk.pipe(mergeMap(api => api.website.remove(id))),
    });
  }

  private _updateCompanyError: Index<ApiError> = {};
  readonly updateCompanyError = (id: string): ApiError => this._updateCompanyError[id];

  private _updatingCompany = new Set<string>();
  readonly updatingCompany = (id: string) => this._updatingCompany.has(id);

  readonly updateCompany = (id: Id, website: ApiWebsiteUpdateCompany): Observable<ApiWebsiteWithCompany> => {
    return this.utils.getSecuredReportApiSdk.pipe(
      tap(_ => {
        this._updatingCompany.add(id);
        delete this._updateCompanyError[id];
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

  protected unregisteredSource = new BehaviorSubject<HostWithReportCount[] | undefined>(undefined);

  private _fetchingUnregistered = false;
  get fetchingUnregistered() {
    return this._fetchingUnregistered;
  }

  private _fetchUnregisteredError?: ApiError;
  get fetchUnregisteredError() {
    return this._fetchUnregisteredError;
  }

  readonly listUnregistered = (q?: string, start?: Date, end?: Date): Observable<HostWithReportCount[]> => {
    return this.utils.getSecuredReportApiSdk.pipe(
      tap(_ => {
        this._fetchingUnregistered = true;
        this._fetchUnregisteredError = undefined;
      }),
      mergeMap(api => api.website.listUnregistered(
        q,
        start ? format(start, 'yyyy-MM-dd') : null,
        end ? format(end, 'yyyy-MM-dd') : null)
      ),
      map(results => results.map (_ => ({
        host: _.host,
        count: _.count
      }))),
      tap(r => {
        this._fetchingUnregistered = false;
        this.unregisteredSource.next(r);
      }),
      mergeMap(_ => this.unregisteredSource.asObservable()),
      catchError((err: ApiError) => {
        this._fetchingUnregistered = false;
        this._fetchUnregisteredError = err;
        return throwError(err);
      })
    );
  }


  readonly extractUnregistered = (q?: string, start?: Date, end?: Date): Observable<HostWithReportCount[]> => {
    return this.utils.getSecuredReportApiSdk.pipe(
      mergeMap(api => api.website.extractUnregistered(
        q,
        start ? format(start, 'yyyy-MM-dd') : null,
        end ? format(end, 'yyyy-MM-dd') : null)
      )
    );
  }
}

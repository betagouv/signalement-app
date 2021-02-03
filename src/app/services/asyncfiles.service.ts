import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './core/service.utils';
import { mergeMap } from 'rxjs/operators';
import { AsyncFile } from '../model/AsyncFile';

@Injectable({
  providedIn: 'root'
})
export class AsyncFilesService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  listAsyncFiles() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<AsyncFile[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'async-files']),
          headers
        );
      })
    );
  }
}

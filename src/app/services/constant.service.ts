import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) { }

  getActionPros() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<string[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'constants', 'actionPros']),
          headers
        );
      })
    );
  }
}

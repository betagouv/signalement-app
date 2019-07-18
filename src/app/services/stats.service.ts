import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { map } from 'rxjs/operators';
import { deserialize } from 'json-typescript-mapper';
import { Statistics } from '../model/Statistics';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  getStatistics() {
    return this.http.get(this.serviceUtils.getUrl(Api.Report, ['api', 'stats']))
      .pipe(
        map(result => {
          return deserialize(Statistics, result);
        })
      );
  }
}

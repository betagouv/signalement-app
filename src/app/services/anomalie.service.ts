import { Injectable } from '@angular/core';
import { AnomalieList } from '../model/Anomalie';
import { HttpClient } from '@angular/common/http';
import { deserialize } from 'json-typescript-mapper';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnomalieService {

  constructor(private http: HttpClient) { }

  getAnomalies() {

    return this.http.get('./assets/data/anomalies.json')
      .pipe(
        map(result => {
          return deserialize(AnomalieList, result).list;
        })
      );
  }




}

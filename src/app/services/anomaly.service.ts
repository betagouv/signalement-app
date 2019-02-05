import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import anomalies from '../../assets/data/anomalies.json';
import { deserialize } from 'json-typescript-mapper';
import { AnomalyList } from '../model/Anomaly';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  constructor(private http: HttpClient) { }

  getAnomalies() {
    return deserialize(AnomalyList, anomalies).list;
  }

}

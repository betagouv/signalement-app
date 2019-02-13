import { Injectable } from '@angular/core';

import anomalies from '../../assets/data/anomalies.json';
import { deserialize } from 'json-typescript-mapper';
import { AnomalyList } from '../model/Anomaly';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  constructor() { }

  getAnomalies() {
    return deserialize(AnomalyList, anomalies).list;
  }

  getAnomalyByCategory(category: String) {
    return this.getAnomalies()
      .find(anomaly => anomaly.category === category);
  }

}

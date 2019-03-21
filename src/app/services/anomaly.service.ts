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

  getAnomalyBy(predicate: (anomaly) => boolean) {
    return this.getAnomalies()
      .find(predicate);
  }

  getAnomalyByCategory(category: String) {
    return this.getAnomalyBy(anomaly => anomaly.category === category);
  }

  getAnomalyByCategoryId(categoryId: String) {
    return this.getAnomalyBy(anomaly => anomaly.categoryId === categoryId);
  }

}

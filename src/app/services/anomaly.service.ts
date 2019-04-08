import { Injectable, isDevMode } from '@angular/core';

import anomalies from '../../assets/data/anomalies.json';
import { deserialize } from 'json-typescript-mapper';
import { Anomaly, AnomalyList } from '../model/Anomaly';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  anomalies: Anomaly[];

  constructor() {
    this.anomalies = this.getAnomalies();
  }

  getAnomalies() {
    // rechargement à chaque fois si l'on est en mode développement
    if (!this.anomalies || isDevMode()) {
      this.anomalies = deserialize(AnomalyList, anomalies).list;
    }
    return this.anomalies;
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

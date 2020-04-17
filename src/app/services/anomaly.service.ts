import { Injectable } from '@angular/core';
import anomalies from '../../assets/data/anomalies.json';
import { Anomaly } from '../model/Anomaly';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  anomalies: Anomaly[];

  constructor() {
    this.anomalies = this.getAnomalies();
  }

  getAnomalies() {
    if (!this.anomalies) {
      this.anomalies = anomalies.list;
    }
    return this.anomalies;
  }

  getAnomalyBy(predicate: (anomaly) => boolean) {
    return this.getAnomalies()
      .find(predicate);
  }

  getAnomalyByCategory(category: string) {
    return this.getAnomalyBy(anomaly => anomaly.category === category);
  }

  getAnomalyByCategoryId(categoryId: string) {
    return this.getAnomalyBy(anomaly => anomaly.categoryId === categoryId);
  }

  getCategories() {
    return this.getAnomalies().filter(anomaly => !anomaly.information).map(anomaly => anomaly.category);
  }

}

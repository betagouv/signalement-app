import { Inject, Injectable, Optional } from '@angular/core';
import anomaliesJSON from '@signal-conso/signalconso-api-sdk-js/lib/client/anomaly/yml/anomalies.json';
import { Anomaly, collectTags, enrichAnomaly, InternetTag } from '../model/Anomaly';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  constructor(@Inject('anomalies') @Optional() private readonly anomalies: Anomaly[]) {
    if (!anomalies) {
      this.anomalies = anomaliesJSON.list.map(enrichAnomaly) as Anomaly[];
    }
  }

  getAnomalies() {
    return this.anomalies;
  }

  getAnomalyBy(predicate: (anomaly: Anomaly) => boolean) {
    return this.anomalies
      .find(predicate);
  }

  getAnomalyByCategory(category: string) {
    return this.getAnomalyBy(anomaly => anomaly.category === category);
  }

  getAnomalyByCategoryId(categoryId: string) {
    return this.getAnomalyBy(anomaly => anomaly.categoryId === categoryId);
  }
}

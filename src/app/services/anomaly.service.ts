import { Injectable } from '@angular/core';

import anomaliesV1 from '../../assets/data/anomalies-v1.json';
import anomaliesV2 from '../../assets/data/anomalies-v2.json';
import { deserialize } from 'json-typescript-mapper';
import { Anomaly, AnomalyList } from '../model/Anomaly';
import { AbTestsService } from 'angular-ab-tests';
import { CategoryScope, CategoryVersions } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  anomalies: Anomaly[];

  constructor(private abTestsService: AbTestsService) {
    this.anomalies = this.getAnomalies();
  }

  getAnomalies() {
    if (!this.anomalies) {
      this.anomalies = this.abTestsService.getVersion(CategoryScope) === CategoryVersions.V1 ?
        deserialize(AnomalyList, anomaliesV1).list : deserialize(AnomalyList, anomaliesV2).list;
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

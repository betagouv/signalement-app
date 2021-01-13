import { Inject, Injectable, Optional } from '@angular/core';
import anomaliesJSON from '../../assets/data/anomalies.json';
import { Anomaly, enrichAnomaly, InternetTag, Subcategory } from '../model/Anomaly';

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

  getCategories() {
    return this.anomalies.filter(anomaly => !anomaly.information).map(anomaly => anomaly.category);
  }

  getTags(): string[] {
    return [InternetTag].concat(...this.anomalies.map(anomaly => this.collectTags(anomaly)))
      .filter((tag, index, tags) => tags.indexOf(tag) === index)
      .sort((t1, t2) => t1.toString().localeCompare(t2.toString()));
  }

  private collectTags(data: Subcategory | Anomaly): string[] {
    return ((data as Subcategory).tags || []).concat(...(data.subcategories || []).map(s => this.collectTags(s)));
  }
}

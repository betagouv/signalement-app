import { Injectable } from '@angular/core';
import anomalies from '../../assets/data/anomalies.json';
import { Anomaly, enrichAnomaly, InternetTag, Subcategory } from '../model/Anomaly';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  readonly anomalies: Anomaly[] = anomalies.list.map(enrichAnomaly);

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

  getTags() {
    return [InternetTag].concat(...this.anomalies.map(anomaly => this.collectTags(anomaly)))
      .filter((tag, index, tags) => tags.indexOf(tag) === index)
      .sort((t1, t2) => t1.toString().localeCompare(t2.toString()));
  }

  private collectTags(data: Subcategory | Anomaly) {
    return ((data as Subcategory).tags || []).concat(...(data.subcategories || []).map(s => this.collectTags(s)));
  }

}

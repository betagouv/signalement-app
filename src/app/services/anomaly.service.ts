import { Injectable } from '@angular/core';
import anomalies from '../../assets/data/anomalies.json';
import { Anomaly, InternetTag, Subcategory } from '../model/Anomaly';

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
      this.anomalies = anomalies.list
        .map(a => Object.assign(new Anomaly(), a))
        .map(a => Object.assign(a, {subcategories: a.getSubcategoriesData().subcategories}));
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

  getTags() {
    return [InternetTag].concat(...this.getAnomalies().map(anomaly => this.collectTags(anomaly)))
      .filter((tag, index, tags) => tags.indexOf(tag) === index)
      .sort((t1, t2) => t1.toString().localeCompare(t2.toString()));
  }

  private collectTags(data: Subcategory | Anomaly) {
    return ((data as Subcategory).tags || []).concat(...(data.subcategories || []).map(s => this.collectTags(s)));
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './core/service.utils';
import { Subcategory } from '../model/Anomaly';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  rate(category: string, subcategories: Subcategory[], positive: boolean) {
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'rating']),
      {
        category,
        subcategories: subcategories ? subcategories.map(subcategory => subcategory.title ? subcategory.title : subcategory) : [''],
        positive
      }
    );
  }

}

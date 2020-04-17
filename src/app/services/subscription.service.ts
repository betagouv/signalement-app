import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from '../model/Subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  subscribe(subscription: Subscription) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.post<Subscription>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'subscriptions']),
          subscription,
          headers
        );
      }),
    );
  }

  getSubscriptions() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<Subscription[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'subscriptions']),
          headers
        );
      })
    );
  }

  removeSubscription(subscriptionId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.delete(
          this.serviceUtils.getUrl(Api.Report, ['api', 'subscriptions', subscriptionId]),
          headers
        );
      })
    );
  }
}

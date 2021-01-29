import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './core/service.utils';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from '../model/Subscription';
import { Department } from '../model/Region';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) {
  }

  createOrUpdateSubscription(subscription: Subscription) {
    const subscriptionApi = {
      departments: subscription.departments.map(dept => dept.code),
      categories: subscription.categories,
      sirets: subscription.sirets,
      frequency: subscription.frequency,
    };
    if (subscription.id) {
      return this.serviceUtils.getAuthHeaders().pipe(
        mergeMap(headers => {
          return this.http.put<Subscription>(
            this.serviceUtils.getUrl(Api.Report, ['api', 'subscriptions', subscription.id]),
            subscriptionApi,
            headers
          );
        }),
      );
    } else {
      return this.serviceUtils.getAuthHeaders().pipe(
        mergeMap(headers => {
          return this.http.post<Subscription>(
            this.serviceUtils.getUrl(Api.Report, ['api', 'subscriptions']),
            subscriptionApi,
            headers
          );
        }),
      );
    }
  }

  getSubscription(subscriptionId: string) {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<Subscription>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'subscriptions', subscriptionId]),
          headers
        );
      }),
      mergeMap(subscriptionApi => of(this.subscriptionApiToSubscription(subscriptionApi)))
    );
  }

  getSubscriptions() {
    return this.serviceUtils.getAuthHeaders().pipe(
      mergeMap(headers => {
        return this.http.get<Subscription[]>(
          this.serviceUtils.getUrl(Api.Report, ['api', 'subscriptions']),
          headers
        );
      }),
      mergeMap(subscriptionsApi => of(subscriptionsApi.map(s => this.subscriptionApiToSubscription(s))))
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

  subscriptionApiToSubscription(subscriptionApi) {
    return Object.assign(new Subscription(), {
      id: subscriptionApi.id,
      userId: subscriptionApi.userId,
      departments: subscriptionApi.departments.map(code => Department.fromCode(code)),
      categories: subscriptionApi.categories,
      sirets: subscriptionApi.sirets,
      frequency: subscriptionApi.frequency
    });
  }
}

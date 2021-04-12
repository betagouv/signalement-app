import { Component } from '@angular/core';
import { SubscriptionService } from '../../../services/subscription.service';
import { ApiSubscription } from '../../../api-sdk/model/ApiSubscription';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent {

  constructor(
    public subscriptionService: SubscriptionService,
  ) {
  }

  readonly subscriptions$ = this.subscriptionService.list();

  readonly create = () => {
    this.subscriptionService.create({
      categories: [],
      departments: [],
      sirets: [],
      tags: [],
      countries: [],
      frequency: 'P7D'
    }, { insertBefore: true }).subscribe();
  };

  readonly trackBy = (index: number, item: ApiSubscription) => item.id;
}

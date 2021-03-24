import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SubscriptionService } from '../../../services/subscription.service';
import pages from '../../../../assets/data/pages.json';
import { ApiSubscription } from '../../../api-sdk/model/ApiSubscription';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent {

  constructor(
    private titleService: Title,
    private meta: Meta,
    public subscriptionService: SubscriptionService,
  ) {
    this.titleService.setTitle(pages.secured.subscriptions.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.subscriptions.description });
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

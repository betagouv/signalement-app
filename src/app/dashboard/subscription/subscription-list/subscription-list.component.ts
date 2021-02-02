import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SubscriptionService } from '../../../services/subscription.service';
import pages from '../../../../assets/data/pages.json';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.titleService.setTitle(pages.secured.subscriptions.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.subscriptions.description });
  }

  readonly subscriptions$ = this.subscriptionService.list();

  redirectSubscription(subscriptionId?: string) {
    this.router.navigate(['abonnements', subscriptionId ? subscriptionId : 'nouveau']);
  }
}

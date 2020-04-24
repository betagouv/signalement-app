import { Component, OnInit } from '@angular/core';
import { Subscription } from '../../../model/Subscription';
import { Meta, Title } from '@angular/platform-browser';
import { SubscriptionService } from '../../../services/subscription.service';
import pages from '../../../../assets/data/pages.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {

  subscriptions: Subscription[];

  loading: boolean;
  loadingError: boolean;

  constructor(private titleService: Title,
              private meta: Meta,
              private subscriptionService: SubscriptionService,
              private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.subscriptions.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.subscriptions.description });

    this.loading = true;
    this.subscriptionService.getSubscriptions().subscribe(
      subscriptions => {
        this.subscriptions = subscriptions;
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      }
    );
  }

  openSubscription(subscriptionId?: string) {
    this.router.navigate(['abonnements', subscriptionId ? subscriptionId : 'nouveau']);
  }

  removeSubscription(removeId: string, event) {
    event.stopPropagation();
    this.loading = true;
    this.subscriptionService.removeSubscription(removeId).subscribe(
      _ => {
        this.loading = false;
        this.subscriptions.splice(this.subscriptions.findIndex(s => s.id === removeId), 1);
      }
    );
  }

}

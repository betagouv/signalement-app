import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import consumerActionsList from '../../../assets/data/consumer-actions.json';
import { ActivatedRoute, Router } from '@angular/router';
import { Information } from '../../model/Anomaly';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contractual-dispute',
  templateUrl: './contractual-dispute.component.html',
  styleUrls: ['./contractual-dispute.component.css']
})
export class ContractualDisputeComponent implements OnInit {

  consumerActions: Information[];
  currentStep = 0;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private titleService: Title,
              private meta: Meta,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle(pages.contractualDispute.title);
    this.meta.updateTag({ name: 'description', content: pages.contractualDispute.description });

    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        const consumerActionsItem = consumerActionsList.list.filter(a => a.consumerActionsId === paramMap.get('consumerActionsId'))[0];

        if (consumerActionsItem) {
          this.consumerActions = consumerActionsItem.consumerActions;
        } else {
          this.router.navigate(['not-found']);
        }
      }
    );

  }

  continue() {
    this.currentStep ++;
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
  }

  back() {
    this.currentStep --;
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
  }

}

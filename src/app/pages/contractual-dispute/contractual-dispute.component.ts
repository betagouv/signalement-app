import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { isPlatformBrowser } from '@angular/common';
import {
  AccountEventActions,
  ActionResultNames,
  AnalyticsService,
  ContractualDisputeActions, ContractualDisputeNames,
  EventCategories,
} from '../../services/analytics.service';

@Component({
  selector: 'app-contractual-dispute',
  templateUrl: './contractual-dispute.component.html',
  styleUrls: ['./contractual-dispute.component.scss']
})
export class ContractualDisputeComponent implements OnInit {

  currentStep = 1;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private titleService: Title,
              private meta: Meta,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.contractualDispute.title);
    this.meta.updateTag({ name: 'description', content: pages.contractualDispute.description });
    this.trackCurrentStep();
  }

  continue() {
    this.currentStep ++;
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
    this.trackCurrentStep();
  }

  back() {
    this.currentStep --;
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
  }

  trackCurrentStep() {
    this.analyticsService.trackEvent(
      EventCategories.contractualDispute,
      ContractualDisputeActions.consult,
      `${ContractualDisputeNames.step} n°${this.currentStep}`
    );
  }

  downloadDocumentTemplate() {
    this.analyticsService.trackEvent(
      EventCategories.contractualDispute, ContractualDisputeActions.downloadTemplate);
  }

}

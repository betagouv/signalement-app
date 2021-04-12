import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnalyticsService, ContractualDisputeActions, ContractualDisputeNames, EventCategories, } from '../../services/analytics.service';

@Component({
  selector: 'app-contractual-dispute',
  templateUrl: './contractual-dispute.component.html',
  styleUrls: ['./contractual-dispute.component.scss']
})
export class ContractualDisputeComponent implements OnInit {

  currentStep = 1;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
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

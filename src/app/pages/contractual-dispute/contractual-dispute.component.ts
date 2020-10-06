import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contractual-dispute',
  templateUrl: './contractual-dispute.component.html',
  styleUrls: ['./contractual-dispute.component.scss']
})
export class ContractualDisputeComponent implements OnInit {

  currentStep = 1;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.contractualDispute.title);
    this.meta.updateTag({ name: 'description', content: pages.contractualDispute.description });
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

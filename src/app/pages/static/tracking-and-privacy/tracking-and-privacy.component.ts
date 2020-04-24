import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-tracking-and-privacy',
  templateUrl: './tracking-and-privacy.component.html',
  styleUrls: ['./tracking-and-privacy.component.scss']
})
export class TrackingAndPrivacyComponent implements OnInit {


  constructor(private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.trackingAndPrivacy.title);
    this.meta.updateTag({ name: 'description', content: pages.trackingAndPrivacy.description });
  }

}

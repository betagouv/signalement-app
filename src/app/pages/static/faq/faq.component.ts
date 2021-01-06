import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pro',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  isFaqConso = true;

  fragment: string;

  constructor(private titleService: Title,
              private meta: Meta,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.faq.title);
    this.meta.updateTag({ name: 'description', content: pages.faq.description });

    this.activatedRoute.url.subscribe(url => {
      if (url[1]) {
        this.isFaqConso = url[1].toString() === 'consommateur';
      }
    });
    this.activatedRoute.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  changeTab() {
    this.isFaqConso = !this.isFaqConso;
  }
}

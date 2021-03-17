import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pro',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  isFaqConso = true;

  fragment: string;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
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

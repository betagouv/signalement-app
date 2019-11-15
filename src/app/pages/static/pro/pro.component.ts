import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss']
})
export class ProComponent implements OnInit {

  fragment: string;

  constructor(private titleService: Title,
              private meta: Meta,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.pro.title);
    this.meta.updateTag({ name: 'description', content: pages.pro.description });

    this.activatedRoute.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

}

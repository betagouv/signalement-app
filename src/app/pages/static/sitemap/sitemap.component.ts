import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  constructor(private titleService: Title,
              private meta: Meta) { }
  ngOnInit() {
    this.titleService.setTitle(pages.sitemap.title);
    this.meta.updateTag({ name: 'description', content: pages.sitemap.description });
  }
}

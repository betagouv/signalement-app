import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  constructor(private titleService: Title,
              private meta: Meta,
              private route: ActivatedRoute) { }
  ngOnInit() {
    this.titleService.setTitle(pages.aidealanavigation.title);
    this.meta.updateTag({ name: 'description', content: pages.aidealanavigation.description });
  }
}

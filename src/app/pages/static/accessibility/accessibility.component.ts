import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html'
})
export class AccessibilityComponent implements OnInit {
  constructor(private titleService: Title,
              private meta: Meta,
              private route: ActivatedRoute) { }
  ngOnInit() {
    this.titleService.setTitle(pages.accessibilite.title);
    this.meta.updateTag({ name: 'description', content: pages.accessibilite.description });
  }
}

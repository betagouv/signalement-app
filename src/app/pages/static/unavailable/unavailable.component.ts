import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-unavailable',
  templateUrl: './unavailable.component.html'
})
export class UnavailableComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.notfound.title);
    this.meta.updateTag({ name: 'description', content: pages.notfound.description });
  }

}

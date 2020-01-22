import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html'
})
export class NotFoundComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.notfound.title);
    this.meta.updateTag({ name: 'description', content: pages.notfound.description });
  }

}

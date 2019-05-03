import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss']
})
export class CguComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.cgu.title);
    this.meta.updateTag({ name: 'description', content: pages.cgu.description });
  }


}

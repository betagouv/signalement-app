import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss']
})
export class CguComponent implements OnInit {

  isCguConso = true;

  constructor(private titleService: Title,
              private meta: Meta,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.cgu.title);
    this.meta.updateTag({ name: 'description', content: pages.cgu.description });

    this.route.url.subscribe(url => {
      if (url[1]) {
        this.isCguConso = url[1].toString() === 'consommateur';
      }

    });
  }

}

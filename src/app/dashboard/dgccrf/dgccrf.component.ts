import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';

@Component({
  selector: 'app-how',
  templateUrl: './dgccrf.component.html',
  styleUrls: ['./dgccrf.component.scss']
})
export class DGCCRFComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.dgccrf.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.dgccrf.description });
  }

}

import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.login.title);
    this.meta.updateTag({ name: 'description', content: pages.login.description });
  }

}

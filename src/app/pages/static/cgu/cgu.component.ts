import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss']
})
export class CguComponent implements OnInit {

  isCguConso = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.url.subscribe(url => {
      if (url[1]) {
        this.isCguConso = url[1].toString() === 'consommateur';
      }
    });
  }

  changeTab() {
    this.isCguConso = !this.isCguConso;
  }

}

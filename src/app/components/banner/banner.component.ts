import { Component, Input, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Input() title;
  @Input() subTitle;
  @Input() backButton;

  constructor(private platformLocation: PlatformLocation) { }

  ngOnInit() {
  }

  back() {
    this.platformLocation.back();
  }
}

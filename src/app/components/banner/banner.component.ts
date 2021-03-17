import { Component, Input, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Input() title?: string;
  @Input() subTitle?: string;
  @Input() backButton?: boolean;

  constructor(private platformLocation: PlatformLocation) {
  }

  ngOnInit() {
  }

  back() {
    this.platformLocation.back();
  }
}

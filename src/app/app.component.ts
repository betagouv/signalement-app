import { Component, Inject, Injector, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AtInternetService } from './services/at-internet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  @ViewChild('header') header;
  @ViewChild('content') content;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private injector: Injector,
              private router: Router,
              private atInternetService: AtInternetService,
              private activatedRoute: ActivatedRoute
  ) {

    if (isPlatformBrowser(this.platformId)) {
      const angulartics2Piwik: Angulartics2Piwik = injector.get(Angulartics2Piwik);
      angulartics2Piwik.startTracking();
    }
  }

  ngOnInit() {
  // @ts-ignore
    testErrorFromOnlinePR();
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.atInternetService.send({name: event.url.replace(/[^\w]/gi, '')});
        if (!this.activatedRoute.snapshot.fragment) {
          this.header.nativeElement.focus();
        } else if (this.activatedRoute.snapshot.fragment === 'content') {
          this.content.nativeElement.focus();
        }
      }
    });
  }

  getCurrentNavigation() {
    return this.router.url;
  }

}

import { Component, Inject, Injector, PLATFORM_ID } from '@angular/core';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private injector: Injector) {

    if (isPlatformBrowser(this.platformId)) {
      const angulartics2Piwik: Angulartics2Piwik = injector.get(Angulartics2Piwik);
      angulartics2Piwik.startTracking();
    }
  }

}

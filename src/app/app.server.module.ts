import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { Inject, Injectable, NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { REQUEST } from '@nguniversal/express-engine/tokens';


/**
 * Extract from https://github.com/adrdilauro/angular-ab-tests/blob/master/src/app/modules/angular-ab-tests/server/server-crawler-detector.service.ts
 * since the injection of REQUEST cause an issue with default import...
 */
@Injectable({
  providedIn: 'root',
})
export class ServerCrawlerDetectorService {

  constructor(@Inject(REQUEST) private httpRequest) {}

  private _regexps: RegExp[] = [
    /bot/i, /spider/i, /facebookexternalhit/i, /simplepie/i, /yahooseeker/i, /embedly/i,
    /quora link preview/i, /outbrain/i, /vkshare/i, /monit/i, /Pingability/i, /Monitoring/i,
    /WinHttpRequest/i, /Apache-HttpClient/i, /getprismatic.com/i, /python-requests/i, /Twurly/i,
    /yandex/i, /browserproxy/i, /Monitoring/i, /crawler/i, /Qwantify/i, /Yahoo! Slurp/i, /pinterest/i
  ];

  isCrawler() {
    return this._regexps.some((crawler) => {
      return crawler.test(this.getUserAgentString());
    });
  }

  protected getUserAgentString(): string {
    if (this.httpRequest) {
      const useAgentHeader = this.httpRequest.headers['user-agent'];
      return Array.isArray(useAgentHeader) ? useAgentHeader[0] : useAgentHeader;
    }
    return '';
  }

}


@NgModule({
  bootstrap: [AppComponent],

  imports: [
    BrowserModule.withServerTransition({ appId: 'app-root' }),
    AppModule,
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
  ],
})
export class AppServerModule {
}

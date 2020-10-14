import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AbTestsServerModule, CrawlerDetector } from 'angular-ab-tests';
import { CookiesService } from 'ngx-utils-cookies-port';

@NgModule({
  bootstrap: [AppComponent],

  imports: [
    BrowserModule.withServerTransition({ appId: 'app-root' }),
    AppModule,
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    AbTestsServerModule,
  ],
  providers: [
    CookiesService,
    CrawlerDetector
  ]
})
export class AppServerModule {
}

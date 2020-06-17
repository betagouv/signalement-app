import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './pages/footer/footer.component';
import { RouterModule } from '@angular/router';
import { StatsComponent } from './pages/stats/stats.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReportModule } from './pages/report/report.module';
import { NgxLoadingModule } from 'ngx-loading';
import localeFr from '@angular/common/locales/fr';
import { SecuredModule } from './pages/secured/secured.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { StaticModule } from './pages/static/static.module';
import { AccountMenuComponent } from './pages/header/account-menu/account-menu.component';
import { NotFoundComponent } from './pages/static/notfound/notfound.component';
import { TooltipModule } from 'ngx-bootstrap';
import { AccountModule } from './pages/account/account.module';
import { CompaniesModule } from './pages/companies/companies.module';
import { Angulartics2Module } from 'angulartics2';
import { ComponentsModule, NgxLoadingConfig } from './components/components.module';
import { ReportsModule } from './pages/reports/reports.module';
import { environment } from '../environments/environment';
import * as SentryBrowser from '@sentry/browser';
import { AbTestsModule } from 'angular-ab-tests';
import { SVETestingScope, SVETestingVersions } from './utils';
import { AppRoleModule } from './directives/app-role/app-role.module';
import { AppPermissionModule } from './directives/app-permission/app-permission.module';
import { SubscriptionModule } from './pages/subscription/subscription.module';

registerLocaleData(localeFr, 'fr');

class ErrorLogger extends ErrorHandler {

  static initWith(sentry: any) {
    return () => new ErrorLogger(sentry);
  }

  constructor(private sentry: any) {
    super();
    if (environment.sentryDsn) {
      this.sentry.init({ dsn: environment.sentryDsn });
    }
  }

  handleError(error: any): void {
    if (environment.sentryDsn) {
      this.sentry.captureException(error.originalError || error);
    }
    super.handleError(error);   // for default behaviour rather than silently dying
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    StatsComponent,
    AccountMenuComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    NgxEchartsModule,
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    RouterModule.forRoot([
      { path: 'stats', component: StatsComponent },
      { path: '**', component: NotFoundComponent },
    ], {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
    ReportModule,
    ReportsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AccountModule,
    CompaniesModule,
    SecuredModule,
    SubscriptionModule,
    StaticModule,
    BsDropdownModule.forRoot(),
    TooltipModule,
    Angulartics2Module.forRoot(),
    ComponentsModule,
    AbTestsModule.forRoot(
      [
        {
          versions: [ SVETestingVersions.NoTest, SVETestingVersions.Test1, SVETestingVersions.Test2 ],
          versionForCrawlers: SVETestingVersions.NoTest,
          scope: SVETestingScope,
          expiration: 5,
          weights: {
            NoTest: 0,
            Test3_Sentence1: 10,
            Test3_Sentence2: 10,
            Test3_Sentence3: 10,
            Test3_Sentence4: 10,
            Test3_Sentence5: 10
          }
        }
      ]
    ),
    AppRoleModule,
    AppPermissionModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: ErrorHandler, useFactory: ErrorLogger.initWith(SentryBrowser) }
  ]
})
export class AppModule {
}

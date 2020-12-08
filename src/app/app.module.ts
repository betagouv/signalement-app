import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
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
import { NotFoundComponent } from './pages/static/notfound/notfound.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccountModule } from './pages/account/account.module';
import { CompaniesModule } from './pages/companies/companies.module';
import { Angulartics2Module } from 'angulartics2';
import { ComponentsModule, NgxLoadingConfig } from './components/components.module';
import { ReportsModule } from './pages/reports/reports.module';
import { environment } from '../environments/environment';
import * as SentryBrowser from '@sentry/browser';
import { AppRoleModule } from './directives/app-role/app-role.module';
import { AppPermissionModule } from './directives/app-permission/app-permission.module';
import { SubscriptionModule } from './pages/subscription/subscription.module';
import { HeaderModule } from './pages/header/header.module';
import { ContractualDisputeModule } from './pages/contractual-dispute/contractual-dispute.module';
import * as echarts from 'echarts';
import { ManageWebsitesModule } from './pages/manage-websites/manage-websites.module';

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
        FooterComponent,
        StatsComponent,
        NotFoundComponent,
    ],
    imports: [
        CommonModule,
        NgtUniversalModule,
        TransferHttpCacheModule,
        HttpClientModule,
        NgxEchartsModule.forRoot({ echarts }),
        NgxLoadingModule.forRoot(NgxLoadingConfig),
        RouterModule.forRoot([
          { path: 'stats', component: StatsComponent },
          { path: 'not-found', component: NotFoundComponent },
          { path: '**', component: NotFoundComponent },
        ], {
          scrollPositionRestoration: 'top',
          anchorScrolling: 'enabled',
          initialNavigation: 'enabled'
        }),
      HeaderModule,
      ReportModule,
      ReportsModule,
      ManageWebsitesModule,
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
        AppRoleModule,
        AppPermissionModule,
        ContractualDisputeModule
    ],
    exports: [
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'fr' },
        { provide: ErrorHandler, useFactory: ErrorLogger.initWith(SentryBrowser) },
    ],
})
export class AppModule {
}

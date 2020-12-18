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
import { ReportModule } from './pages/report/report.module';
import localeFr from '@angular/common/locales/fr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NotFoundComponent } from './pages/static/notfound/notfound.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccountModule } from './pages/account/account.module';
import { Angulartics2Module } from 'angulartics2';
import { ComponentsModule, NgxLoadingConfig } from './components/components.module';
import { environment } from '../environments/environment';
import * as SentryBrowser from '@sentry/browser';
import { AppRoleModule } from './directives/app-role/app-role.module';
import { AppPermissionModule } from './directives/app-permission/app-permission.module';
import { HeaderModule } from './pages/header/header.module';
import { ContractualDisputeModule } from './pages/contractual-dispute/contractual-dispute.module';
import { NgxLoadingModule } from 'ngx-loading';
import { CompaniesModule } from './pages/companies/companies.module';
import { SubscriptionModule } from './dashboard/subscription/subscription.module';

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
        NotFoundComponent,
    ],
    imports: [
        CommonModule,
        NgtUniversalModule,
        TransferHttpCacheModule,
        HttpClientModule,
        NgxLoadingModule.forRoot(NgxLoadingConfig),
        RouterModule.forRoot([
          { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(_ => _.DashboardModule) },
          { path: '', loadChildren: () => import('./pages/stats/stats.module').then(_ => _.StatsModule) },
          { path: '', loadChildren: () => import('./pages/static/static.module').then(_ => _.StaticModule) },
          { path: 'not-found', component: NotFoundComponent },
          { path: '**', component: NotFoundComponent },
        ], {
          scrollPositionRestoration: 'top',
          anchorScrolling: 'enabled',
          initialNavigation: 'enabled'
        }),
      HeaderModule,
      ReportModule,
      BrowserModule,
      BrowserAnimationsModule,
      AccountModule,
      CompaniesModule,
      SubscriptionModule,
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

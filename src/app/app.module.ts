import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './pages/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { ReportModule } from './pages/report/report.module';
import localeFr from '@angular/common/locales/fr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NotFoundComponent } from './pages/static/notfound/notfound.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccountModule } from './pages/account/account.module';
import { Angulartics2Module } from 'angulartics2';
import { ComponentsModule, NgxLoadingConfig } from './components/components.module';
import { environment } from '../environments/environment';
import { AppRoleModule } from './directives/app-role/app-role.module';
import { AppPermissionModule } from './directives/app-permission/app-permission.module';
import { HeaderModule } from './pages/header/header.module';
import { ContractualDisputeModule } from './pages/contractual-dispute/contractual-dispute.module';
import { NgxLoadingModule } from 'ngx-loading';
import { CompaniesModule } from './pages/companies/companies.module';
import * as Sentry from '@sentry/angular';

registerLocaleData(localeFr, 'fr');

Sentry.init({ dsn: environment.sentryDsn });

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
          { path: '', loadChildren: () => import('./pages/stats/stats.module').then(_ => _.StatsModule) },
          { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(_ => _.DashboardModule) },
          { path: '', loadChildren: () => import('./pages/static/static.module').then(_ => _.StaticModule) },
          { path: '', loadChildren: () => import('./pages/anomlies-tree/anomalies-tree.module').then(_ => _.AnomaliesTreeModule) },
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
      { provide: ErrorHandler, useValue: Sentry.createErrorHandler()},
      { provide: Sentry.TraceService, deps: [Router], },
      { provide: APP_INITIALIZER, useFactory: () => () => {}, deps: [Sentry.TraceService], multi: true, },
    ],
})
export class AppModule {
}

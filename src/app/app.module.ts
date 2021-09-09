import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './pages/footer/footer.component';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { ReportModule } from './pages/report/report.module';
import localeFr from '@angular/common/locales/fr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NotFoundComponent } from './pages/static/notfound/notfound.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Angulartics2Module } from 'angulartics2';
import { ComponentsModule, NgxLoadingConfig } from './components/components.module';
import { environment } from '../environments/environment';
import * as SentryBrowser from '@sentry/browser';
import { AppRoleModule } from './directives/app-role/app-role.module';
import { AppPermissionModule } from './directives/app-permission/app-permission.module';
import { HeaderModule } from './pages/header/header.module';
import { ContractualDisputeModule } from './pages/contractual-dispute/contractual-dispute.module';
import { NgxLoadingModule } from 'ngx-loading';
import { PageModule } from './dashboard/shared/page/page.module';
import { dashboardRoutes } from 'src/dashboardRoutes';

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
      { path: '', loadChildren: () => import('./pages/stats/stats.module').then(_ => _.StatsModule) },
      // { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(_ => _.DashboardModule) },
      { path: '', loadChildren: () => import('./pages/static/static.module').then(_ => _.StaticModule) },
      { path: '', loadChildren: () => import('./pages/anomlies-tree/anomalies-tree.module').then(_ => _.AnomaliesTreeModule) },
      { path: 'not-found', component: NotFoundComponent },
      // { path: '**', component: NotFoundComponent },
    ], {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabled'
    }),
    HeaderModule,
    ReportModule,
    BrowserModule,
    BrowserAnimationsModule,
    // AccountModule,
    // CompaniesModule,
    BsDropdownModule.forRoot(),
    TooltipModule,
    Angulartics2Module.forRoot(),
    ComponentsModule,
    AppRoleModule,
    AppPermissionModule,
    ContractualDisputeModule,
    PageModule
  ],
  exports: [],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: ErrorHandler, useFactory: ErrorLogger.initWith(SentryBrowser) },
  ],
})
export class AppModule {

  readonly routesMapping: {[key: string]: {redirectTo: (string | ((...args: string[]) => string))}} = {
    '/mode-emploi-dgccrf': { redirectTo: dashboardRoutes.modeEmploiDGCCRF, },
    '/mes-telechargements': { redirectTo: dashboardRoutes.reports, },
    '/admin/invitation-ccrf': { redirectTo: dashboardRoutes.users, },
    '/compte/mot-de-passe': { redirectTo: dashboardRoutes.settings, },
    '/entreprise/acces/([^\/]*?)': { redirectTo: siret => dashboardRoutes.companyAccesses(siret) },
    '/entreprise/acces/:siret/invitation': { redirectTo: '' },
    '/mes-entreprises': { redirectTo: dashboardRoutes.companiesPro },
    '/entreprises': { redirectTo: dashboardRoutes.companies },
    '/entreprises/les-plus-signalees': { redirectTo: dashboardRoutes.companies_registered },
    '/entreprises/recherche': { redirectTo: dashboardRoutes.companies_registered },
    '/entreprises/a-activer': { redirectTo: dashboardRoutes.companies_toActivate },
    '/suivi-des-telephones': { redirectTo: dashboardRoutes.reportedPhone },
    '/suivi-des-signalements/([^\/]*?)/avis': { redirectTo: reportId => dashboardRoutes.consumerReview(reportId) },
    '/suivi-des-signalements': { redirectTo: dashboardRoutes.reports },
    '/suivi-des-signalements/pro': { redirectTo: dashboardRoutes.reports },
    '/suivi-des-signalements/admin': { redirectTo: dashboardRoutes.reports },
    '/suivi-des-signalements/dgccrf': { redirectTo: dashboardRoutes.reports },
    '/suivi-des-signalements/report/([^\/]*?)': { redirectTo: id => dashboardRoutes.report(id) },
    '/abonnements': { redirectTo: dashboardRoutes.subscriptions },
    '/moderation-url-entreprises': { redirectTo: dashboardRoutes.reportedWebsites },
    '/sites-internet/non-identifies': { redirectTo: dashboardRoutes.reportedWebsites_unknown },
    '/login': { redirectTo: dashboardRoutes.login },
    '/connexion': { redirectTo: dashboardRoutes.login },
    '/dgccrf': { redirectTo: dashboardRoutes.login },
    '/connexion/validation-email': { redirectTo: dashboardRoutes.emailValidation },
    '/connexion/perte-mot-de-passe': { redirectTo: dashboardRoutes.login },
    '/connexion/perte-mot-de-passe/dgccrf': { redirectTo: dashboardRoutes.login },
    '/connexion/nouveau-mot-de-passe/:token': { redirectTo: dashboardRoutes.resetPassword },
    '/compte/inscription': { redirectTo: dashboardRoutes.register },
    '/entreprise/rejoindre/([^\/]*?)': { redirectTo: dashboardRoutes.register },
    '/dgccrf/rejoindre': { redirectTo: dashboardRoutes.register },
    'entreprise/activation': { redirectTo: dashboardRoutes.registerBis },
    'activation': { redirectTo: dashboardRoutes.register },
  };

  constructor(
    private router: Router,
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.redirect(event.url);
      }
    });
  }

  private readonly redirect = (currentPath: string) => {
    const match = this.findMatch(currentPath);
    if (match) {
      window.location.href = environment.dashboardBaseUrl + this.getRedirection(currentPath, match);
    } else {
      console.error(`No redirection to dashoard for ${currentPath}.`);
    }
  };

  private readonly findMatch = (currentRoute: string): [string, {redirectTo: (string | ((...args: string[]) => string))}] | undefined => {
    return Object.entries(this.routesMapping).find(([route, redirect]) => {
      const regexp = new RegExp(route);
      return regexp.test(`^${currentRoute}$`);
    });
  };

  private readonly getArgs = (currentPath: string, pattern: string): string[] => {
    return currentPath.match(new RegExp(`^${pattern}$`)).slice(1);
  };

  private readonly getRedirection = (currentPath: string,
    match: [string, {redirectTo: (string | ((...args: string[]) => string))}]): string => {
    const [matchedRoute, redirection] = match;
    if (typeof redirection.redirectTo === 'function') {
      const args = this.getArgs(currentPath, matchedRoute);
      return redirection.redirectTo(...args);
    } else {
      return redirection.redirectTo;
    }
  };
}

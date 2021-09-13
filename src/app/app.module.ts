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

registerLocaleData(localeFr, 'fr');

class ErrorLogger extends ErrorHandler {

  static initWith(sentry: any) {
    return () => new ErrorLogger(sentry);
  }

  constructor(private sentry: any) {
    super();
    if (environment.sentryDsn) {
      this.sentry.init({ dsn: environment.sentryDsn, tracesSampleRate: .5});
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

  private readonly dashboardRoutes = {
    reportedWebsites: '/moderation-url-entreprises',
    reportedCompanyWebsites: '/moderation-url-entreprises/site-internet',
    reportedWebsites_unknown: '/moderation-url-entreprises/sites-internet/non-identifies',
    reportedPhone: '/suivi-des-telephones',
    reports: '/suivi-des-signalements',
    subscriptions: '/abonnements',
    report: (id: string = ':id') => `/suivi-des-signalements/report/${id}`,
    exports: '/mes-telechargements',
    companies: '/entreprises',
    companiesPro: '/mes-entreprises',
    activatePro: (siret: string = ':siret') => `/entreprise/rejoindre/${siret}`,
    companyAccesses: (siret: string = ':siret') => `/entreprise/acces/${siret}`,
    companies_toActivate: '/entreprises/a-activer',
    companies_registered: '/entreprises/les-plus-signalees',
    users: '/admin/invitation-ccrf',
    users_pending: '/admin/invitation-ccrf/pending',
    users_all: '/admin/invitation-ccrf/all',
    settings: '/parametres',
    register: '/activation',
    registerBis: '/entreprise/activation',
    login: '/connexion',
    emailValidation: '/connexion/validation-email',
    resetPassword: (token: string = ':token') => `/connexion/nouveau-mot-de-passe/${token}`,
    modeEmploiDGCCRF: '/mode-emploi-dgccrf',
    consumerReview: (reportId: string = ':reportId') => `/suivi-des-signalements/${reportId}/avis`,
  };


  private readonly routesMapping: {[key: string]: {redirectTo: (string | ((...args: string[]) => string))}} = {
    '/mode-emploi-dgccrf': { redirectTo: this.dashboardRoutes.modeEmploiDGCCRF, },
    '/mes-telechargements': { redirectTo: this.dashboardRoutes.reports, },
    '/admin/invitation-ccrf': { redirectTo: this.dashboardRoutes.users, },
    '/compte/mot-de-passe': { redirectTo: this.dashboardRoutes.settings, },
    '/entreprise/acces/([^\/]*?)': { redirectTo: siret => this.dashboardRoutes.companyAccesses(siret) },
    '/entreprise/acces/:siret/invitation': { redirectTo: '' },
    '/mes-entreprises': { redirectTo: this.dashboardRoutes.companiesPro },
    '/entreprises': { redirectTo: this.dashboardRoutes.companies },
    '/entreprises/les-plus-signalees': { redirectTo: this.dashboardRoutes.companies_registered },
    '/entreprises/recherche': { redirectTo: this.dashboardRoutes.companies_registered },
    '/entreprises/a-activer': { redirectTo: this.dashboardRoutes.companies_toActivate },
    '/suivi-des-telephones': { redirectTo: this.dashboardRoutes.reportedPhone },
    '/suivi-des-signalements/([^\/]*?)/avis': { redirectTo: reportId => this.dashboardRoutes.consumerReview(reportId) },
    '/suivi-des-signalements': { redirectTo: this.dashboardRoutes.reports },
    '/suivi-des-signalements/pro': { redirectTo: this.dashboardRoutes.reports },
    '/suivi-des-signalements/admin': { redirectTo: this.dashboardRoutes.reports },
    '/suivi-des-signalements/dgccrf': { redirectTo: this.dashboardRoutes.reports },
    '/suivi-des-signalements/report/([^\/]*?)': { redirectTo: id => this.dashboardRoutes.report(id) },
    '/abonnements': { redirectTo: this.dashboardRoutes.subscriptions },
    '/moderation-url-entreprises': { redirectTo: this.dashboardRoutes.reportedWebsites },
    '/sites-internet/non-identifies': { redirectTo: this.dashboardRoutes.reportedWebsites_unknown },
    '/login': { redirectTo: this.dashboardRoutes.login },
    '/connexion': { redirectTo: this.dashboardRoutes.login },
    '/dgccrf': { redirectTo: this.dashboardRoutes.login },
    '/connexion/validation-email': { redirectTo: this.dashboardRoutes.emailValidation },
    '/connexion/perte-mot-de-passe': { redirectTo: this.dashboardRoutes.login },
    '/connexion/perte-mot-de-passe/dgccrf': { redirectTo: this.dashboardRoutes.login },
    '/connexion/nouveau-mot-de-passe/:token': { redirectTo: this.dashboardRoutes.resetPassword },
    '/compte/inscription': { redirectTo: this.dashboardRoutes.register },
    '/entreprise/rejoindre/([^\/]*?)': { redirectTo: this.dashboardRoutes.activatePro },
    '/dgccrf/rejoindre': { redirectTo: this.dashboardRoutes.register },
    'entreprise/activation': { redirectTo: this.dashboardRoutes.registerBis },
    'activation': { redirectTo: this.dashboardRoutes.register },
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

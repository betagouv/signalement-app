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
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxLoadingModule } from 'ngx-loading';
import localeFr from '@angular/common/locales/fr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { StaticModule } from './pages/static/static.module';
import { NotFoundComponent } from './pages/static/notfound/notfound.component';
import { TooltipModule } from 'ngx-bootstrap';
import { Angulartics2Module } from 'angulartics2';
import { UnavailableComponent } from './pages/static/unavailable/unavailable.component';
import { StatsComponent } from './pages/stats/stats.component';
import { ComponentsModule, NgxLoadingConfig } from './components/components.module';
import { environment } from '../environments/environment';
import { HeaderModule } from './pages/header/header.module';
import { AppRoleModule } from './directives/app-role/app-role.module';
import { AppPermissionModule } from './directives/app-permission/app-permission.module';

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
    UnavailableComponent,
    StatsComponent,
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
      { path: '**', component: UnavailableComponent },
    ], {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
    BrowserModule,
    BrowserAnimationsModule,
    StaticModule,
    BsDropdownModule.forRoot(),
    TooltipModule,
    Angulartics2Module.forRoot(),
    ComponentsModule,
    HeaderModule,
    AppRoleModule,
    AppPermissionModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
  ]
})
export class AppModule {
}

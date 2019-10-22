import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { LOCALE_ID, NgModule } from '@angular/core';
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
import { ReportComponent } from './pages/report/report.component';
import { LoginModule } from './pages/login/login.module';
import { SecuredModule } from './pages/secured/secured.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { StaticModule } from './pages/static/static.module';
import { AbTestsModule } from 'angular-ab-tests';
import { CategoryScope, CategoryVersions } from './utils';
import { AccountMenuComponent } from './pages/header/account-menu/account-menu.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    StatsComponent,
    AccountMenuComponent,
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    NgxEchartsModule,
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
    RouterModule.forRoot([
      { path: 'stats', component: StatsComponent },
      { path: '**', component: ReportComponent },
      { path: '**', redirectTo: '' }
    ], {scrollPositionRestoration: 'top'}),
    ReportModule,
    BrowserModule,
    BrowserAnimationsModule,
    LoginModule,
    SecuredModule,
    StaticModule,
    BsDropdownModule.forRoot(),
    AbTestsModule.forRoot(
      [
        {
          versions: [ CategoryVersions.V1, CategoryVersions.V2 ],
          versionForCrawlers: CategoryVersions.V1,
          scope: CategoryScope,
          expiration: 5,
          weights: { V1: 0, V2: 99 }
        }
      ]
    )
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
  ]
})
export class AppModule {
}

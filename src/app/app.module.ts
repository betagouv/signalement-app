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
import { HowComponent } from './pages/static/how/how.component';
import { AboutComponent } from './pages/static/about/about.component';
import { ProComponent } from './pages/static/pro/pro.component';
import { RouterModule } from '@angular/router';
import { StatsComponent } from './pages/stats/stats.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReportModule } from './pages/report/report.module';
import { NgxLoadingModule } from 'ngx-loading';
import localeFr from '@angular/common/locales/fr';
import { ReportComponent } from './pages/report/report.component';
import { LoginModule } from './pages/login/login.module';
import { SecuredModule } from './pages/secured/secured.module';
import { RetractationComponent } from './pages/static/retractation/retractation.component';
import { CguComponent } from './pages/static/cgu/cgu.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BlogComponent } from './pages/static/blog/blog.component';
import { MarkdownModule } from 'ngx-markdown';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HowComponent,
    AboutComponent,
    ProComponent,
    StatsComponent,
    CguComponent,
    BlogComponent,
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    HttpClientModule,
    NgxEchartsModule,
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
    RouterModule.forRoot([
      { path: '', component: ReportComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'comment-ça-marche', component: HowComponent },
      { path: 'qui-sommes-nous', component: AboutComponent },
      { path: 'vous-êtes-un-professionnel', component: ProComponent },
      { path: 'delai-de-retractation', component: RetractationComponent },
      { path: 'conditions-generales-utilisation', component: CguComponent },
      { path: 'blog/:article', component: BlogComponent }
    ], {scrollPositionRestoration: 'top'}),
    ReportModule,
    BrowserModule,
    BrowserAnimationsModule,
    LoginModule,
    SecuredModule,
    BsDropdownModule.forRoot(),
    MarkdownModule.forRoot(),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
  ]
})
export class AppModule {
}

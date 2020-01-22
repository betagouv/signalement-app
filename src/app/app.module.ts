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
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxLoadingModule } from 'ngx-loading';
import localeFr from '@angular/common/locales/fr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { StaticModule } from './pages/static/static.module';
import { TooltipModule } from 'ngx-bootstrap';
import { Angulartics2Module } from 'angulartics2';
import { UnavailableComponent } from './pages/static/unavailable/unavailable.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UnavailableComponent,
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    NgxEchartsModule,
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
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
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
  ]
})
export class AppModule {
}

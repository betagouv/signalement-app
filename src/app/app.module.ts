import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './pages/footer/footer.component';
import { HowComponent } from './pages/infos/how/how.component';
import { RouterModule } from '@angular/router';
import { StatsComponent } from './pages/stats/stats.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CategoryComponent } from './pages/report/category/category.component';
import { ReportModule } from './pages/report/report.module';
import { NgxLoadingModule } from 'ngx-loading';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HowComponent,
    StatsComponent,
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
      { path: '', component: CategoryComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'comment-ça-marche', component: HowComponent },
    ]),
    ReportModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
  ]
})
export class AppModule {
}

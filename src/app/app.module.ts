import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './pages/footer/footer.component';
import { HowComponent } from './pages/infos/how/how.component';
import { AboutComponent } from './pages/infos/about/about.component';
import { RouterModule } from '@angular/router';
import { StatsComponent } from './pages/stats/stats.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CategoryComponent } from './pages/report/category/category.component';
import { ReportModule } from './pages/report/report.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HowComponent,
    AboutComponent,
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
      { path: 'qui-sommes-nous', component: AboutComponent }
    ]),
    ReportModule,
  ],
  providers: [],
})
export class AppModule {
}

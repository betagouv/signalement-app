import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { ReportComponent } from './pages/report/report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, frLocale } from 'ngx-bootstrap';
import { FileInputComponent } from './components/file-input/file-input.component';
import { Ng2CompleterModule } from 'ng2-completer';
import { CompanyComponent } from './pages/report/company/company.component';
import { FooterComponent } from './pages/footer/footer.component';
import { WhyComponent } from './pages/infos/why/why.component';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';
import { Angulartics2Module } from 'angulartics2';
import { StatsComponent } from './pages/stats/stats.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DetailsComponent } from './pages/report/details/details.component';
import { BreadcrumbComponent } from './pages/report/breadcrumb/breadcrumb.component';
import { ConsumerComponent } from './pages/report/consumer/consumer.component';

defineLocale('fr', frLocale);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReportComponent,
    FileInputComponent,
    CompanyComponent,
    FooterComponent,
    WhyComponent,
    StatsComponent,
    DetailsComponent,
    BreadcrumbComponent,
    ConsumerComponent,
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
    Ng2CompleterModule,
    Angulartics2Module.forRoot(),
    NgxEchartsModule,
    RouterModule.forRoot([
      { path: '', component: ReportComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'infos/why', component: WhyComponent },
    ]),
  ],
  providers: [],
})
export class AppModule {
}

import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from './banner/banner.component';
import { CompanySearchResultsModule } from './company-search-results/company-search-results.module';
import { ForeignCompanySearchResultsModule, } from './foreign-company-search-results/foreign-company-search-results.module';
import { CommonModule } from '@angular/common';
import { BadgeModule } from './badge/badge.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from './panel/panel.module';
import { PageModule } from './page/page.module';
import { AlertModule } from './alert/alert';
import { MatIconModule } from '@angular/material/icon';
import { RadioContainerModule } from './radio-container/radio-container.module';
import { BtnModule } from './btn/btn.module';
import { ConfirmModule } from './confirm/confirm.module';
import { LoadingModule } from './loading/loading.module';
import { FenderModule } from './fender/fender';

export const NgxLoadingConfig = { primaryColour: '#407e9a', secondaryColour: '#2A8194', tertiaryColour: '#1f2b50' };

@NgModule({
  declarations: [
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
  ],
  imports: [
    CommonModule,
    RadioContainerModule,
    PipesModule,
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    CompanySearchResultsModule,
    ForeignCompanySearchResultsModule,
    PanelModule,
    PageModule,
    AlertModule,
  ],
  exports: [
    PanelModule,
    PageModule,
    AlertModule,
    RadioContainerModule,
    FormsModule,
    CommonModule,
    NgxLoadingModule,
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
    CompanySearchResultsModule,
    ForeignCompanySearchResultsModule,
    BadgeModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    PanelModule,
    PageModule,
    BtnModule,
    ConfirmModule,
    LoadingModule,
    FormsModule,
    ReactiveFormsModule,
    FenderModule,
    AlertModule,
  ],
  providers: [
  ]
})
export class ComponentsModule { }


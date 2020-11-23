import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from './banner/banner.component';
import { CompanySearchResultsModule } from './company-search-results/company-search-results.module';
import { PanelModule } from './panel/panel.module';
import { PageModule } from './page/page.module';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { LabelStatusModule } from './label-status/label-status.module';
import { BtnLoadingModule } from './btn-loading/btn-loading.module';
import { AlertModule } from './alert/alert.module';

export const NgxLoadingConfig = { primaryColour: '#407e9a', secondaryColour: '#2A8194', tertiaryColour: '#1f2b50' };


@NgModule({
  declarations: [
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
  ],
  imports: [
    CommonModule,
    PipesModule,
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    CompanySearchResultsModule
  ],
  exports: [
    LabelStatusModule,
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
    CompanySearchResultsModule,
    PanelModule,
    PageModule,
    MaterialModule,
    BtnLoadingModule,
    AlertModule
  ],
  providers: [
  ]
})
export class ComponentsModule { }


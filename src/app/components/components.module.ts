import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from './banner/banner.component';
import { CompanySearchResultsModule } from './company-search-results/company-search-results.module';
import { CommonModule } from '@angular/common';
import { BadgeStatusModule } from './label-status/badge-status.module';
import { BadgeModule } from './badge/badge.module';
import { FormsModule } from '@angular/forms';
import { PanelModule } from '../dashboard/shared/panel/panel.module';
import { PageModule } from '../dashboard/shared/page/page.module';
import { AlertModule } from '../dashboard/shared/alert/alert';
import { MatIconModule } from '@angular/material/icon';

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
    CompanySearchResultsModule,
    PanelModule,
    PageModule,
    AlertModule,
  ],
  exports: [
    PanelModule,
    PageModule,
    AlertModule,
    FormsModule,
    CommonModule,
    NgxLoadingModule,
    BadgeStatusModule,
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
    CompanySearchResultsModule,
    BadgeModule,
    MatIconModule,
  ],
  providers: [
  ]
})
export class ComponentsModule { }


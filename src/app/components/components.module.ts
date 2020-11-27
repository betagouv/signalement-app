import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from './banner/banner.component';
import { PanelModule } from './panel/panel.module';
import { PageModule } from './page/page.module';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { BadgeStatusModule } from './label-status/badge-status.module';
import { BadgeModule } from './badge/badge.module';

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
  ],
  exports: [
    BadgeStatusModule,
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
    PanelModule,
    PageModule,
    MaterialModule,
    BadgeModule,
    BadgeStatusModule,
  ],
  providers: [
  ]
})
export class ComponentsModule { }


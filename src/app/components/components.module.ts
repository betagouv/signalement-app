import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from './banner/banner.component';
import { PanelModule } from './panel/panel.module';
import { PageModule } from './page/page.module';
import { MaterialModule } from './material.module';
import { FenderModule } from './fender/fender.module';

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
    FenderModule,
    NgxLoadingModule.forRoot(NgxLoadingConfig),
  ],
  exports: [
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
    PanelModule,
    PageModule,
    MaterialModule,
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class ComponentsModule { }


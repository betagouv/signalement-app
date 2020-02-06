import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from './banner/banner.component';

export const NgxLoadingConfig = { primaryColour: '#407ea7', secondaryColour: '#2A8194', tertiaryColour: '#1f2b50' };

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
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class ComponentsModule { }


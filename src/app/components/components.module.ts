import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from './banner/banner.component';
import { AppMultiSelectModule } from './multiselect/multiselect.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';

export const NgxLoadingConfig = {primaryColour: '#407e9a', secondaryColour: '#2A8194', tertiaryColour: '#1f2b50'};

const MatModules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
];

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
    ...MatModules,
  ],
  exports: [
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
    ...MatModules,
  ],
  providers: [
  ]
})
export class ComponentsModule { }


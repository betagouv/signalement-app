import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { BannerComponent } from './banner/banner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatPseudoCheckboxModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { PanelModule } from './panel/panel.module';
import { PageModule } from './page/page.module';

export const NgxLoadingConfig = { primaryColour: '#407e9a', secondaryColour: '#2A8194', tertiaryColour: '#1f2b50' };

const matModules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatCheckboxModule,
  MatPseudoCheckboxModule,
  MatRippleModule,
  MatDatepickerModule,
  MatNativeDateModule,
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
  ],
  exports: [
    CollapsableTextComponent,
    AttachmentsComponent,
    BannerComponent,
    PanelModule,
    PageModule,
    ...matModules,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  entryComponents: [
  ]
})
export class ComponentsModule { }


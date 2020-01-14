import { NgModule } from '@angular/core';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CollapsableTextComponent } from './collapsable-text/collapsable-text.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [
    CollapsableTextComponent,
    AttachmentsComponent,
  ],
  imports: [
    CommonModule,
    PipesModule,
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
  ],
  exports: [
    CollapsableTextComponent,
    AttachmentsComponent,
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class ComponentsModule { }


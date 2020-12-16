import { NgModule } from '@angular/core';
import { PipesModule } from '../../pipes/pipes.module';
import { NgxLoadingModule } from 'ngx-loading';
import { PanelModule } from './panel/panel.module';
import { PageModule } from './page/page.module';
import { CommonModule } from '@angular/common';
import { BtnModule } from './btn/btn.module';
import { ConfirmModule } from './confirm/confirm.module';
import { LoadingModule } from './loading/loading.module';
import { MaterialModule } from './material.module';

export const NgxLoadingConfig = { primaryColour: '#407e9a', secondaryColour: '#2A8194', tertiaryColour: '#1f2b50' };

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PipesModule,
    NgxLoadingModule.forRoot(NgxLoadingConfig),
  ],
  exports: [
    CommonModule,
    NgxLoadingModule,
    PanelModule,
    PageModule,
    BtnModule,
    ConfirmModule,
    LoadingModule,
    MaterialModule,
  ],
  providers: []
})
export class SharedModule {
}


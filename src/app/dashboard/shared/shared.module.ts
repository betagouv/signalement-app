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
import { NgxLoadingConfig } from '../../components/components.module';
import { FenderModule } from './fender/fender';
import { AlertModule } from './alert/alert';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PipesModule,
    NgxLoadingModule.forRoot(NgxLoadingConfig),
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxLoadingModule,
    PanelModule,
    PageModule,
    BtnModule,
    ConfirmModule,
    LoadingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FenderModule,
    AlertModule,
  ],
  providers: [],
})
export class SharedModule {
}


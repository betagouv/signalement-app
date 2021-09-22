import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    NgxLoadingModule,
  ],
  exports: [
    PageComponent
  ],
  declarations: [
    PageComponent
  ],
})
export class PageModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnLoadingComponent } from './btn-loading.component';
import { BtnLoadingDirective } from './btn-loading.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  exports: [
    BtnLoadingDirective,
    BtnLoadingComponent,
  ],
  declarations: [
    BtnLoadingDirective,
    BtnLoadingComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [BtnLoadingComponent]
})
export class BtnLoadingModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { LoadingDirective } from './loading.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  exports: [
    LoadingDirective,
    LoadingComponent,
  ],
  declarations: [
    LoadingDirective,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [LoadingComponent]
})
export class LoadingModule {
}

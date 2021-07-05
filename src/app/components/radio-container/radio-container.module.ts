import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioContainerComponent } from './radio-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    RadioContainerComponent
  ],
  exports: [
    RadioContainerComponent
  ],
})
export class RadioContainerModule {
}


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    RadioButtonComponent
  ],
  exports: [
    RadioButtonComponent
  ],
})
export class RadioButtonModule {
}


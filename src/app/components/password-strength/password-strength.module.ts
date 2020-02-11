import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordStrengthComponent } from './password-strength.component';


@NgModule({
  declarations: [
    PasswordStrengthComponent,
  ],
  exports: [
    PasswordStrengthComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class PasswordStrengthModule { }

import { NgModule } from '@angular/core';
import { AppRoleDirective } from './app-role.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppRoleDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AppRoleDirective
  ],
})
export class AppRoleModule { }


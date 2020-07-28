import { NgModule } from '@angular/core';
import { AppPermissionDirective } from './app-permission.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppPermissionDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AppPermissionDirective
  ],
})
export class AppPermissionModule { }


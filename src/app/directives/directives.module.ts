import { NgModule } from '@angular/core';
import { AppPermissionDirective } from './app-permission/app-permission.directive';
import { AppRoleDirective } from './app-role/app-role.directive';

@NgModule({
  declarations: [
    AppPermissionDirective,
    AppRoleDirective,
  ],
  imports: [],
  exports: [
    AppPermissionDirective,
    AppRoleDirective,
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class DirectivesModule { }


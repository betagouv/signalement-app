import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { AppPermissionModule } from '../../directives/app-permission/app-permission.module';
import { HeaderComponent } from './header.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    HeaderComponent,
    AccountMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppRoleModule,
    AppPermissionModule,
    BsDropdownModule
  ],
  exports: [
    AccountMenuComponent,
    HeaderComponent
  ]
})
export class HeaderModule { }

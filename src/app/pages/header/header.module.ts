import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    ComponentsModule,
    RouterModule,
    BsDropdownModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeStatusComponent } from './badge-status.component';
import { BadgeModule } from '../badge/badge.module';

@NgModule({
  imports: [
    CommonModule,
    BadgeModule,
  ],
  exports: [
    BadgeStatusComponent,
  ],
  declarations: [
    BadgeStatusComponent,
  ],
})
export class BadgeStatusModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { ConfirmDialogComponent, ConfirmDialogDirective } from './confirm.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  exports: [
    ConfirmDialogDirective,
    ConfirmDialogComponent,
  ],
  declarations: [
    ConfirmDialogDirective,
    ConfirmDialogComponent,
  ],
  imports: [
    MatDialogModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
  ],
})
export class ConfirmModule {
}

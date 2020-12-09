import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CountryDialogComponent } from './country-dialog.component';
import { CountryDialogDirective } from './country-dialog.directive';
import { CountryInputComponent } from './country-input.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  exports: [
    CountryDialogComponent,
    CountryDialogDirective,
    CountryInputComponent,
  ],
  declarations: [
    CountryDialogComponent,
    CountryDialogDirective,
    CountryInputComponent,
  ],
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
  ],
})
export class CountryDialogModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
  ],
  exports: [
    PanelComponent,
  ],
  declarations: [
    PanelComponent,
  ],
})
export class PanelModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PanelHeaderComponent } from './panel-header.component';
import { PanelBodyComponent } from './panel-body.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
  ],
  exports: [
    PanelComponent,
    PanelHeaderComponent,
    PanelBodyComponent,
  ],
  declarations: [
    PanelComponent,
    PanelHeaderComponent,
    PanelBodyComponent,
  ],
})
export class PanelModule {
}

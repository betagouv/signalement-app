import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PanelHeaderComponent } from './panel-header.component';
import { PanelBodyComponent } from './panel-body.component';
import { PanelActionsComponent } from './panel-actions.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
  ],
  exports: [
    PanelActionsComponent,
    PanelComponent,
    PanelHeaderComponent,
    PanelBodyComponent,
  ],
  declarations: [
    PanelActionsComponent,
    PanelComponent,
    PanelHeaderComponent,
    PanelBodyComponent,
  ],
})
export class PanelModule {
}

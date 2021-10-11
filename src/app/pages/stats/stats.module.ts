import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StatsComponent } from './stats.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';
import { NgxLoadingModule } from 'ngx-loading';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PageModule } from '../../components/page/page.module';
import { PanelModule } from '../../components/panel/panel.module';
import { StatsItemComponent } from './stats-item.component';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  { path: 'stats', component: StatsComponent },
];

@NgModule({
  declarations: [
    StatsItemComponent,
    StatsComponent,
  ],
  imports: [
    NgxEchartsModule.forRoot({ echarts }),
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    TooltipModule.forRoot(),
    PageModule,
    PanelModule,
    MatButtonModule,
  ]
})
export class StatsModule { }

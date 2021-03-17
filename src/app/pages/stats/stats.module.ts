import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StatsComponent } from './stats.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ComponentsModule, NgxLoadingConfig } from '../../components/components.module';
import { NgxLoadingModule } from 'ngx-loading';
import { AppRoleModule } from '../../directives/app-role/app-role.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PageModule } from '../../dashboard/shared/page/page.module';
import { PanelModule } from '../../dashboard/shared/panel/panel.module';

const routes: Routes = [
  { path: 'stats', component: StatsComponent },
];

@NgModule({
  declarations: [
    StatsComponent,
  ],
  imports: [
    NgxEchartsModule.forRoot({ echarts }),
    NgxLoadingModule.forRoot(NgxLoadingConfig),
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    AppRoleModule,
    TooltipModule.forRoot(),
    PageModule,
    PanelModule,
  ]
})
export class StatsModule { }

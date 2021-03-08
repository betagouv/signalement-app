import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnomaliesTreeComponent } from './anomalies-tree.component';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../../dashboard/shared/shared.module';
import { MatTreeModule } from '@angular/material/tree';
import { AnomaliesNodeComponent, AnomaliesNodeInfoComponent, AnomaliesNodeInputsComponent } from './anomaly-node.component';
import { CategoryLogoModule } from '../../components/category-logo/category-logo';

const routes: Routes = [
  { path: 'arborescence', component: AnomaliesTreeComponent },
];

@NgModule({
  declarations: [
    AnomaliesTreeComponent,
    AnomaliesNodeComponent,
    AnomaliesNodeInfoComponent,
    AnomaliesNodeInputsComponent,
  ],
  imports: [
    CategoryLogoModule,
    CommonModule,
    SharedModule,
    MatTreeModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ]
})
export class AnomaliesTreeModule {
}

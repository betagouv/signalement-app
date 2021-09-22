import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnomaliesTreeComponent } from './anomalies-tree.component';
import { ComponentsModule } from '../../components/components.module';
import { MatTreeModule } from '@angular/material/tree';
import { AnomaliesNodeComponent, AnomaliesNodeInfoComponent, AnomaliesNodeInputsComponent } from './anomaly-node.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    CommonModule,
    MatTreeModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ]
})
export class AnomaliesTreeModule {
}

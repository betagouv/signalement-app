import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnomaliesTreeComponent } from './anomalies-tree.component';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../../dashboard/shared/shared.module';
import { MatTreeModule } from '@angular/material/tree';

const routes: Routes = [
  { path: 'arborescence', component: AnomaliesTreeComponent },
];

@NgModule({
  declarations: [
    AnomaliesTreeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTreeModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ]
})
export class AnomaliesTreeModule {
}

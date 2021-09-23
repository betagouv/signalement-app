import { NgModule } from '@angular/core';
import { ContractualDisputeComponent } from './contractual-dispute.component';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../../components/components.module';
import { PageModule } from '../../components/page/page.module';
import { PanelModule } from '../../components/panel/panel.module';
import { AlertModule } from '../../components/alert/alert';


const routes: Routes = [
  { path: 'litige', component: ContractualDisputeComponent }
];

@NgModule({
  declarations: [ContractualDisputeComponent],
  imports: [
    RouterModule.forChild(routes),
    ComponentsModule,
    PageModule,
    PanelModule,
    AlertModule
  ]
})
export class ContractualDisputeModule { }

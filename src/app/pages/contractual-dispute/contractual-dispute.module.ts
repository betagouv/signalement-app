import { NgModule } from '@angular/core';
import { ContractualDisputeComponent } from './contractual-dispute.component';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '../../components/components.module';


const routes: Routes = [
  { path: 'litige', component: ContractualDisputeComponent }
];

@NgModule({
  declarations: [ContractualDisputeComponent],
  imports: [
    RouterModule.forChild(routes),
    ComponentsModule
  ]
})
export class ContractualDisputeModule { }

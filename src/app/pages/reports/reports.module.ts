import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ComponentsModule } from '../../components/components.module';
import { ConsumerAdviceComponent } from './consumer-advice/consumer-advice.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'suivi-des-signalements/:reportId/avis', component: ConsumerAdviceComponent }
];

@NgModule({
  declarations: [
    ConsumerAdviceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
    ComponentsModule,
  ]
})
export class ReportsModule { }

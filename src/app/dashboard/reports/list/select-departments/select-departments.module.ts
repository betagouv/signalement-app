import { NgModule } from '@angular/core';
import { SelectDepartmentsComponent } from './select-departments.component';
import { ComponentsModule } from '../../../../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    SelectDepartmentsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
  ],
  exports: [
    SelectDepartmentsComponent
  ]
})
export class SelectDepartmentsModule {
}

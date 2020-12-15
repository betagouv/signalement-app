import { NgModule } from '@angular/core';
import { SelectDepartmentsComponent } from './select-departments.component';
import { ComponentsModule } from '../../../../components/components.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SelectDepartmentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  exports: [
    SelectDepartmentsComponent
  ]
})
export class SelectDepartmentsModule {
}

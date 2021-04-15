import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { Problem2Component } from './problem2.component';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { PageModule } from '../../../dashboard/shared/page/page.module';
import { AlertModule } from '../../../dashboard/shared/alert/alert';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.component';
import { ProblemStepComponent, ProblemStepsComponent } from './problem-step.component';
import { MatButtonModule } from '@angular/material/button';
import { DialogContractualDisputeModule } from './alert-contractual-dispute.component';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    Problem2Component,
    ProblemStepComponent,
    ProblemStepsComponent,
  ],
  imports: [
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    TypeaheadModule.forRoot(),
    AlertModule,
    PageModule,
    MatButtonModule,
    MatRadioModule,
    DialogContractualDisputeModule,
  ],
})
export class Problem2Module {

}


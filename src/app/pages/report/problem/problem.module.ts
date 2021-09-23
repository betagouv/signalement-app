import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ProblemComponent } from './problem.component';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { PageModule } from '../../../components/page/page.module';
import { AlertModule } from '../../../components/alert/alert';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.component';
import { ProblemStepComponent, ProblemStepsComponent } from './problem-step.component';
import { MatButtonModule } from '@angular/material/button';
import { DialogContractualDisputeModule } from './alert-contractual-dispute.component';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    ProblemComponent,
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
export class ProblemModule {

}


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent, IllustrationCardComponent } from './category/category.component';
import { InformationComponent } from './information/information.component';
import { ProblemComponent } from './problem/problem.component';
import { DetailsComponent } from './details/details.component';
import { CompanyComponent } from './company/company.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AcknowledgmentComponent } from './acknowledgment/acknowledgment.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule, BsDatepickerModule, CarouselModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { Ng2CompleterModule } from 'ng2-completer';
import { Angulartics2Module } from 'angulartics2';
import { ReportComponent } from './report.component';
import { SubcategoryComponent } from './problem/subcategory/subcategory.component';
import { AutofocusDirective } from '../../directives/auto-focus.directive';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

defineLocale('fr', frLocale);

const routes: Routes = [];

@NgModule({
  declarations: [
    ReportComponent,
    CompanyComponent,
    DetailsComponent,
    BreadcrumbComponent,
    ConsumerComponent,
    ConfirmationComponent,
    ProblemComponent,
    CategoryComponent,
    IllustrationCardComponent,
    InformationComponent,
    AcknowledgmentComponent,
    SubcategoryComponent,
    AutofocusDirective,
  ],
  entryComponents: [
    CategoryComponent,
    InformationComponent,
    ProblemComponent,
    DetailsComponent,
    ConsumerComponent,
    CompanyComponent,
    ConfirmationComponent,
    AcknowledgmentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
    Ng2CompleterModule,
    Angulartics2Module.forRoot(),
    RouterModule.forChild(routes),
    CarouselModule,
    ComponentsModule,
    PipesModule
  ],
  exports: [
    RouterModule,
    AutofocusDirective,
  ]
})
export class ReportModule { }

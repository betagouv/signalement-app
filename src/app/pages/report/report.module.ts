import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { InformationComponent } from './information/information.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { DetailsComponent } from './details/details.component';
import { CompanyComponent } from './company/company.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AcknowledgmentComponent } from './acknowledgment/acknowledgment.component';
import { FileInputComponent } from '../../components/file-input/file-input.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { Ng2CompleterModule } from 'ng2-completer';
import { Angulartics2Module } from 'angulartics2';
import { CollapsableTextComponent } from '../../components/collapsable-text/collapsable-text.component';
import { PrecedeByPipe } from '../../pipes/precede-by.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ReportPaths } from '../../services/report.service';

defineLocale('fr', frLocale);

const routes: Routes = [
  { path: '', component: CategoryComponent },
  { path: ReportPaths.Information, component: InformationComponent },
  { path: ReportPaths.Subcategory, component: SubcategoryComponent },
  { path: ReportPaths.Details, component: DetailsComponent },
  { path: ReportPaths.Company, component: CompanyComponent },
  { path: ReportPaths.Consumer, component: ConsumerComponent },
  { path: ReportPaths.Confirmation, component: ConfirmationComponent },
  { path: ReportPaths.Acknowledgment, component: AcknowledgmentComponent }
];

@NgModule({
  declarations: [
    FileInputComponent,
    CompanyComponent,
    DetailsComponent,
    BreadcrumbComponent,
    ConsumerComponent,
    ConfirmationComponent,
    SubcategoryComponent,
    CategoryComponent,
    InformationComponent,
    AcknowledgmentComponent,
    CollapsableTextComponent,
    PrecedeByPipe,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
    Ng2CompleterModule,
    Angulartics2Module.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class ReportModule { }

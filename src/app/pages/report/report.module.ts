import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { InformationComponent } from './information/information.component';
import { ProblemComponent } from './problem/problem.component';
import { DetailsComponent } from './details/details.component';
import { CompanyComponent } from './company/company.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AcknowledgmentComponent } from './acknowledgment/acknowledgment.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule, BsDatepickerModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { Ng2CompleterModule } from 'ng2-completer';
import { Angulartics2Module } from 'angulartics2';
import { CollapsableTextComponent } from '../../components/collapsable-text/collapsable-text.component';
import { PrecedeByPipe } from '../../pipes/precede-by.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ReportPaths } from '../../services/report-router.service';
import { RetractationComponent } from '../static/retractation/retractation.component';
import { ReportComponent } from './report.component';
import { SubcategoryComponent } from './problem/subcategory/subcategory.component';
import { deserialize } from 'json-typescript-mapper';
import { AnomalyList } from '../../model/Anomaly';
import anomalies from '../../../assets/data/anomalies.json';

defineLocale('fr', frLocale);

const routes: Routes = deserialize(AnomalyList, anomalies).list
  .map(anomaly => {
    if (anomaly.information) {
      return [
        { path: anomaly.path, component: InformationComponent },
        { path: `${anomaly.path}/${ReportPaths.Information}`, component: InformationComponent }
      ];
    } else {
      return [
        { path: anomaly.path, component: ProblemComponent },
        { path: `${anomaly.path}/${ReportPaths.Information}`, component: InformationComponent },
        { path: `${anomaly.path}/${ReportPaths.Problem}`, component: ProblemComponent },
        { path: `${anomaly.path}/${ReportPaths.Details}`, component: DetailsComponent },
        { path: `${anomaly.path}/${ReportPaths.Company}`, component: CompanyComponent },
        { path: `${anomaly.path}/${ReportPaths.Consumer}`, component: ConsumerComponent },
        { path: `${anomaly.path}/${ReportPaths.Confirmation}`, component: ConfirmationComponent },
        { path: `${anomaly.path}/${ReportPaths.Acknowledgment}`, component: AcknowledgmentComponent }
      ];
    }
  }).reduce((r1, r2) => [...r1, ...r2], [{ path: '', component: CategoryComponent }]);

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
    InformationComponent,
    RetractationComponent,
    AcknowledgmentComponent,
    CollapsableTextComponent,
    PrecedeByPipe,
    TruncatePipe,
    SubcategoryComponent,
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
  ],
  exports: [
    RouterModule,
  ]
})
export class ReportModule { }

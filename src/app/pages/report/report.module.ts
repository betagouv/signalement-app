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
import { ReportComponent } from './report.component';
import { SubcategoryComponent } from './problem/subcategory/subcategory.component';
import { AutofocusDirective } from '../../directives/auto-focus.directive';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import anomalies from '../../../assets/data/anomalies.json';
import { ReportPaths } from '../../services/report-router.service';

defineLocale('fr', frLocale);


const routes: Routes = [{ path: '', component: CategoryComponent }];
routes.push(
  ...anomalies.list
    .map(anomaly => {
      if (anomaly.information) {
        return [
          { path: `${anomaly.path}`, component: InformationComponent },
          { path: `${anomaly.path}/${ReportPaths.Information}`, component: InformationComponent }
        ];
      } else {
        return [
          { path: `${anomaly.path}`, component: ProblemComponent },
          { path: `${anomaly.path}/${ReportPaths.Information}`, component: InformationComponent },
          { path: `${anomaly.path}/${ReportPaths.Problem}`, component: ProblemComponent },
          { path: `${anomaly.path}/${ReportPaths.Details}`, component: DetailsComponent },
          { path: `${anomaly.path}/${ReportPaths.Company}`, component: CompanyComponent },
          { path: `${anomaly.path}/${ReportPaths.Consumer}`, component: ConsumerComponent },
          { path: `${anomaly.path}/${ReportPaths.Confirmation}`, component: ConfirmationComponent },
          { path: `${anomaly.path}/${ReportPaths.Acknowledgment}`, component: AcknowledgmentComponent }
        ];
      }
    })
    .reduce((routes1, routes2) => [...routes1, ...routes2], [])
);

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

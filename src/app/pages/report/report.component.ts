import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { ActivatedRoute, Router } from '@angular/router';
import anomalies from '../../../assets/data/anomalies.json';
import { InformationComponent } from './information/information.component';
import { ReportPaths } from '../../services/report-router.service';
import { ProblemComponent } from './problem/problem.component';
import { DetailsComponent } from './details/details.component';
import { CompanyComponent } from './company/company.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AcknowledgmentComponent } from './acknowledgment/acknowledgment.component';
import { CategoryComponent } from './category/category.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.titleService.setTitle(pages.default.title);
    this.meta.updateTag({ name: 'description', content: pages.default.description });

    this.router.resetConfig(
      [
        ...this.getRoutesForCategories(),
        ...this.router.config.filter(route => route.component !== ReportComponent)
      ]
    );
    console.log('routes', this.router.config)
    this.activatedRoute.url.subscribe(urls => {
      this.router.navigate( urls.map(url => url.path));
    });
  }

  getRoutesForCategories() {
    return anomalies.list
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
      .reduce((routes1, routes2) => [...routes1, ...routes2], [{ path: '', component: CategoryComponent }]);
  }

}

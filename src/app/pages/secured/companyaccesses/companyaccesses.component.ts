import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CompanyAccess } from '../../../model/CompanyAccess';
import { User } from '../../../model/AuthUser.js';
import { AuthenticationService } from '../../../services/authentication.service';
import { accessLevels } from './common';

@Component({
  selector: 'app-company-accesses',
  templateUrl: './companyaccesses.component.html'
})
export class CompanyAccessesComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private companyAccessesService: CompanyAccessesService,
              private route: ActivatedRoute) { }
  
  siret: string;
  user: User;
  companyAccesses: CompanyAccess[];
  accessLevels = accessLevels;

  ngOnInit() {
    this.titleService.setTitle(pages.secured.companyAccesses.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.companyAccesses.description });

    const siretParam = this.route.params.pipe(map(p => p.siret));

    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });
  
    siretParam.subscribe(siret => {
      this.siret = siret;
      this.refresh();
    });
  }

  refresh() {
    this.companyAccessesService.listAccesses(this.siret).subscribe(
      accesses => {
        this.companyAccesses = accesses;
      }
    )
  }

  updateAccess(userId: string, level: string) {
    this.companyAccessesService.updateAccess(this.siret, userId, level).subscribe(() => this.refresh());
  }

  removeAccess(userId: string) {
    this.companyAccessesService.removeAccess(this.siret, userId).subscribe(() => this.refresh())
  }
}

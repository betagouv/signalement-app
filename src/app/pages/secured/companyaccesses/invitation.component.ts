import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { CompanyAccessesService } from '../../../services/companyaccesses.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { accessLevels } from './common';

@Component({
  selector: 'app-company-invitation',
  templateUrl: './invitation.component.html'
})
export class CompanyInvitationComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta,
              private companyAccessesService: CompanyAccessesService,
              private route: ActivatedRoute) { }

  accessLevels = accessLevels;

  ngOnInit() {
    this.titleService.setTitle(pages.secured.companyInvitation.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.companyInvitation.description });

    const siretParam = this.route.params.pipe(map(p => p.siret));
  }
}

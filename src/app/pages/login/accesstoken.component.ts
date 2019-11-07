import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { AnalyticsService, AuthenticationEventActions, EventCategories } from '../../services/analytics.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from '../../model/AuthUser';
import Utils from '../../utils';

@Component({
  selector: 'app-accesstoken',
  templateUrl: './accesstoken.component.html'
})
export class AccessTokenComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }

  hasError = false;

  ngOnInit() {
    this.titleService.setTitle(pages.accesstoken.title);
    this.meta.updateTag({ name: 'description', content: pages.accesstoken.description });

    this.authenticationService.fetchTokenInfo(
      this.route.snapshot.paramMap.get('siret'),
      this.route.snapshot.queryParamMap.get('token'),
    ).subscribe(
      token => {
        // FIXME: handle logged-in user
        this.router.navigate(['compte', 'activation']);
      },
      error => {this.hasError = true}
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';
import { User } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'email-validation',
  templateUrl: './email-validation.component.html'
})
export class EmailValidationComponent implements OnInit {

  constructor(private titleService: Title,
              private meta: Meta,
              private authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }

  loading = false;
  hasError = false;
  token: String;

  ngOnInit() {
    this.titleService.setTitle(pages.account.emailValidation.title);
    this.meta.updateTag({ name: 'description', content: pages.account.emailValidation.description });
    this.validateEmail(this.route.snapshot.queryParamMap.get('token'));
  }

  validateEmail(token) {
    this.loading = true;
    this.authenticationService.validateEmail(token)
    .subscribe(
      (user: User) => {
        this.loading = false;
        this.router.navigate(['suivi-des-signalements', user.roleUrlParam]);
      },
      error => {
        this.loading = false;
        this.hasError = true;
      }
    );
  }
}

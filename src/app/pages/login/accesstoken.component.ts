import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../assets/data/pages.json';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  isAuthenticated = false;
  loading = true;

  ngOnInit() {
    this.titleService.setTitle(pages.accesstoken.title);
    this.meta.updateTag({ name: 'description', content: pages.accesstoken.description });

    this.authenticationService.fetchTokenInfo(
      this.route.snapshot.paramMap.get('siret'),
      this.route.snapshot.queryParamMap.get('token'),
    ).subscribe(
      token => {
        this.authenticationService.isAuthenticated().subscribe(
          isAuthenticated => {
            if (isAuthenticated) {
              this.hasError = true;
              this.isAuthenticated = true;
              this.loading = false;
            } else {
              this.router.navigate(['compte', 'activation']);
            }
          }
        )
      },
      error => {this.loading = false; this.hasError = true}
    )
  }
}

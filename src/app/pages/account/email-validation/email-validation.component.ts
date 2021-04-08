import { Component, OnInit } from '@angular/core';
import { User } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'email-validation',
  templateUrl: './email-validation.component.html'
})
export class EmailValidationComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  loading = true;
  hasError = false;
  token: string;

  ngOnInit() {
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

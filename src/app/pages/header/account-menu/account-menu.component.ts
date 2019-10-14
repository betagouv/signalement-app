import { Component, OnInit } from '@angular/core';
import { Permissions, Roles, User } from '../../../model/AuthUser';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent implements OnInit {

  roles = Roles;
  permissions = Permissions;

  user: User;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    const role = this.user.role;
    this.authenticationService.logout();
    if (role === Roles.Pro) {
      this.router.navigate(['connexion']);
    } else {
      this.router.navigate(['dgccrf']);
    }
  }

}

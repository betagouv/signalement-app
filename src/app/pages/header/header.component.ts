import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Permissions, Roles, User } from '../../model/AuthUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  roles = Roles;
  permissions = Permissions;
  user: User;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });
  }

}

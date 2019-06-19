import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Roles, User } from '../../model/AuthUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  roles = Roles;
  user: User;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.user.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    const role = this.user.role
    this.authenticationService.logout();
    if (role === Roles.Pro) {
      this.router.navigate(['connexion']);
    } else {
      this.router.navigate(['dgccrf']);
    }
  }

  changePassword() {
    this.router.navigate(['compte/mot-de-passe']);
  }

  goHome() {
    this.router.navigate(['suivi-des-signalements']);
  }

}

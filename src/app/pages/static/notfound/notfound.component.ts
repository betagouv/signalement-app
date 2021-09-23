import { Component } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html'
})
export class NotFoundComponent {
  loading = true;

  constructor() {
    this.waitInCaseOfRedirection();
  }

  readonly waitInCaseOfRedirection = () => {
    setTimeout(() => this.loading = false, 2000);
  };
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanySearchDialogComponent } from './company-search-dialog.component';

@Component({
  selector: 'app-company-search-action',
  host: {
    '(click)': 'openDialog()'
  },
  template: `
    <ng-content></ng-content>
  `,
})
export class CompanySearchActionComponent {

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    this.dialog.open(CompanySearchDialogComponent, {
      width: '500px',
    });
  }
}

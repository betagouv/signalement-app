import { Component, Input, OnInit } from '@angular/core';
import { UserAccess } from '../../../model/CompanyAccess';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent implements OnInit {

  @Input() userAccess: UserAccess;

  constructor() { }

  ngOnInit() {
  }

}

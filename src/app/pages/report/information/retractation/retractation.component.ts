import { Component, OnInit } from '@angular/core';
import { isUndefined } from 'util';
import { BsLocaleService } from 'ngx-bootstrap';

@Component({
  selector: 'app-retractation',
  templateUrl: './retractation.component.html',
  styleUrls: ['./retractation.component.scss']
})
export class RetractationComponent implements OnInit {

  contractDate: Date;
  retractationDeadline: Date;

  constructor(private localeService: BsLocaleService) { }

  ngOnInit() {
    this.localeService.use('fr');
  }

  calculRetractationDeadline(contractDate) {
    if (contractDate) {
      this.retractationDeadline = new Date();
      this.retractationDeadline.setDate(contractDate.getDate() + 14);
      while (this.isClosingDate(this.retractationDeadline)) {
        this.retractationDeadline.setDate(this.retractationDeadline.getDate() + 1);
      }
    }
  }


  isClosingDate(date: Date) {
    return date.getDay() === 6 || // samedi
      date.getDay() === 0 || // dimanche
      !isUndefined(closingDays.find(d => d.day === date.getDate() && d.month === date.getMonth())); // jours fériés
  }
}


const closingDays = [
  { day: 1, month: 0 },
  { day: 1, month: 4 },
  { day: 8, month: 4 },
  { day: 14, month: 6 },
  { day: 15, month: 7 },
  { day: 1, month: 10 },
  { day: 11, month: 10 },
  { day: 25, month: 11 }
  ];

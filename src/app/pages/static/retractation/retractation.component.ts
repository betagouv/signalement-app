import { Component } from '@angular/core';
import { isUndefined } from 'util';

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

@Component({
  selector: 'app-retractation',
  templateUrl: './retractation.component.html',
  styleUrls: ['./retractation.component.scss']
})
export class RetractationComponent {

  contractDate: Date;
  retractationDeadline: Date;

  constructor() {
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
    const sunday = 6;
    const saturday = 0;
    return date.getDay() === saturday
      || date.getDay() === sunday
      || !isUndefined(closingDays.find(d => d.day === date.getDate() && d.month === date.getMonth())); // jours fériés
  }
}

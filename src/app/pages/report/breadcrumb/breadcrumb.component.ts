import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Report } from '../../../model/Report';
import { Step } from '../report.component';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() report: Report;
  @Input() step: Step;

  @Output() back = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getStepClass(step: string) {
    return (this.step.toString() === step) ? 'current' : '';
  }

}

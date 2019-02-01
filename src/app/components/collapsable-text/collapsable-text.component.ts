import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-collapsable-text',
  templateUrl: './collapsable-text.component.html',
  styleUrls: ['./collapsable-text.component.css']
})
export class CollapsableTextComponent implements OnInit {

  @Input() content: string;
  isCollapsed: boolean;

  constructor() { }

  ngOnInit() {
    this.isCollapsed = true;
  }

  isTruncable() {
    return this.content.length > 100;
  }

  collapse() {
    this.isCollapsed = true;
  }

  uncollapse() {
    this.isCollapsed = false;
  }

}

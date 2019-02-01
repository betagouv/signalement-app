import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../services/analytics.service';

@Component({
  selector: 'app-collapsable-text',
  templateUrl: './collapsable-text.component.html',
  styleUrls: ['./collapsable-text.component.css']
})
export class CollapsableTextComponent implements OnInit {

  @Input() title: string;
  @Input() content: string;
  isCollapsed: boolean;

  constructor(private analyticsService: AnalyticsService) { }

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
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.information, this.title);
    this.isCollapsed = false;
  }

}

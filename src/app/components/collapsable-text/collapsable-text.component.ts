import { Component, Input } from '@angular/core';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../services/analytics.service';

@Component({
  selector: 'app-collapsable-text',
  templateUrl: './collapsable-text.component.html',
  styleUrls: ['./collapsable-text.component.css']
})
export class CollapsableTextComponent {

  @Input() title?: string;
  @Input() content?: string;
  isCollapsed = true;

  constructor(private analyticsService: AnalyticsService) {
  }

  isTruncable() {
    return this.content && this.content.length > 100;
  }

  collapse() {
    this.isCollapsed = true;
  }

  uncollapse() {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.information, this.title);
    this.isCollapsed = false;
  }

}

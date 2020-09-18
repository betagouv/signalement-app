import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsableTextComponent } from './collapsable-text.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { AnalyticsService } from '../../services/analytics.service';
import { MockAnalyticsService } from '../../../../test/mocks';

describe('CollapsableTextComponent', () => {
  let component: CollapsableTextComponent;
  let fixture: ComponentFixture<CollapsableTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CollapsableTextComponent,
        TruncatePipe,
      ],
      imports: [],
      providers: [
        {provide: AnalyticsService, useClass: MockAnalyticsService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsableTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

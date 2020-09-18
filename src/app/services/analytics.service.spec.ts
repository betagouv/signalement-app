import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { MockAnalyticsService } from '../../../test/mocks';

describe('AnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      {provide: AnalyticsService, useClass: MockAnalyticsService}
    ]
  }));

  it('should be created', () => {
    const service: AnalyticsService = TestBed.get(AnalyticsService);
    expect(service).toBeTruthy();
  });
});

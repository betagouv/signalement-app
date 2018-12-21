import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';

describe('AnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      Angulartics2RouterlessModule.forRoot(),
    ]
  }));

  it('should be created', () => {
    const service: AnalyticsService = TestBed.get(AnalyticsService);
    expect(service).toBeTruthy();
  });
});

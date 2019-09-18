import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';
import { AbTestsService } from 'angular-ab-tests';
import { MockAbTestsService } from '../../test';

describe('AnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      Angulartics2RouterlessModule.forRoot(),
    ],
    providers: [
      { provide: AbTestsService, useClass: MockAbTestsService },
    ]
  }));

  it('should be created', () => {
    const service: AnalyticsService = TestBed.get(AnalyticsService);
    expect(service).toBeTruthy();
  });
});

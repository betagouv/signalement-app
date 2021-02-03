import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceUtils } from './core/service.utils';

describe('StatsService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      ServiceUtils,
    ]
  }));

  it('should be created', () => {
    const service: StatsService = TestBed.inject(StatsService);
    expect(service).toBeTruthy();
  });
});

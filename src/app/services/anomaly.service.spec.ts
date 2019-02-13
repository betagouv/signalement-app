import { TestBed } from '@angular/core/testing';

import { AnomalyService } from './anomaly.service';

describe('AnomalyService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({ });
  });

  it('should be created', () => {
    const service: AnomalyService = TestBed.get(AnomalyService);
    expect(service).toBeTruthy();
  });

});

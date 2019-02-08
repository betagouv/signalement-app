import { TestBed } from '@angular/core/testing';

import { AnomalyService } from './anomaly.service';

describe('AnomalyService', () => {

  let anomalyService: AnomalyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: []
    });
  });

  beforeEach( () => {
    anomalyService = TestBed.get(AnomalyService);
  });

  it('should be created', () => {
    const service: AnomalyService = TestBed.get(AnomalyService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AnomalyService } from './anomaly.service';

describe('AnomalyService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: []
    });
  });

  it('should be created', () => {
    const service: AnomalyService = TestBed.inject(AnomalyService);
    expect(service).toBeTruthy();
  });

});

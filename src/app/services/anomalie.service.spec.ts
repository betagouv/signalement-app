import { TestBed } from '@angular/core/testing';

import { AnomalieService } from './anomalie.service';

describe('AnomalieService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnomalieService = TestBed.get(AnomalieService);
    expect(service).toBeTruthy();
  });
});

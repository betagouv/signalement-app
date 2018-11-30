import { TestBed } from '@angular/core/testing';

import { MunicipalityDataService } from './municipality-data.service';

describe('MunicipalityDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MunicipalityDataService = TestBed.get(MunicipalityDataService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MunicipalityDataService } from './municipality-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MunicipalityDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: MunicipalityDataService = TestBed.get(MunicipalityDataService);
    expect(service).toBeTruthy();
  });
});

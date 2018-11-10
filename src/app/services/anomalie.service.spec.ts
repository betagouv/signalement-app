import { TestBed } from '@angular/core/testing';

import { AnomalieService } from './anomalie.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AnomalieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', () => {
    const service: AnomalieService = TestBed.get(AnomalieService);
    expect(service).toBeTruthy();
  });
});

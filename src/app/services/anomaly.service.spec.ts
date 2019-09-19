import { TestBed } from '@angular/core/testing';

import { AnomalyService } from './anomaly.service';
import { AbTestsService } from 'angular-ab-tests';
import { MockAbTestsService } from '../../test';

describe('AnomalyService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: AbTestsService, useClass: MockAbTestsService },
      ]
    });
  });

  it('should be created', () => {
    const service: AnomalyService = TestBed.get(AnomalyService);
    expect(service).toBeTruthy();
  });

});

import { TestBed } from '@angular/core/testing';

import { ReportStorageService } from './report-storage.service';

describe('ReportStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportStorageService = TestBed.get(ReportStorageService);
    expect(service).toBeTruthy();
  });
});

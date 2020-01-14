import { TestBed } from '@angular/core/testing';

import { ReportRouterService } from './report-router.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReportRouterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
    ],
    providers: []
  }));

  it('should be created', () => {
    const service: ReportRouterService = TestBed.get(ReportRouterService);
    expect(service).toBeTruthy();
  });
});

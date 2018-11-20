import { TestBed } from '@angular/core/testing';

import { SignalementService } from './signalement.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';

describe('SignalementService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      ServiceUtils,
    ]
  }));

  it('should be created', () => {
    const service: SignalementService = TestBed.get(SignalementService);
    expect(service).toBeTruthy();
  });
});

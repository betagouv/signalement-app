import { TestBed } from '@angular/core/testing';

import { RatingService } from './rating.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RatingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ]
  }));

  it('should be created', () => {
    const service: RatingService = TestBed.inject(RatingService);
    expect(service).toBeTruthy();
  });
});

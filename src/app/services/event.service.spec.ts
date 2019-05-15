import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';

describe('EventService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
    providers: [
      ServiceUtils,
    ]
  }));

  it('should be created', () => {
    const service: EventService = TestBed.get(EventService);
    expect(service).toBeTruthy();
  });
});

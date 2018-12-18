import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddressService } from './address.service';

describe('CityData', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: AddressService = TestBed.get(AddressService);
    expect(service).toBeTruthy();
  });
});

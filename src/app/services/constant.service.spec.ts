import { TestBed } from '@angular/core/testing';

import { ConstantService } from './constant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceUtils } from './service.utils';

describe('ConstantService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      ServiceUtils,
    ]
  }));

  it('should be created', () => {
    const service: ConstantService = TestBed.get(ConstantService);
    expect(service).toBeTruthy();
  });
});

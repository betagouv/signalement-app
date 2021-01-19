import { TestBed } from '@angular/core/testing';

import { CompanyService } from './company.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceUtils } from './core/service.utils';

describe('CompanyService', () => {

  let httpMock: HttpTestingController;
  let companyService: CompanyService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      ServiceUtils,
    ]
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    companyService = TestBed.inject(CompanyService);
  });

  it('should be created', () => {
    expect(companyService).toBeTruthy();
  });
});

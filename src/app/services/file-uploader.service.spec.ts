import { TestBed } from '@angular/core/testing';

import { FileUploaderService } from './file-uploader.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FileUploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ],
  }));

  it('should be created', () => {
    const service: FileUploaderService = TestBed.inject(FileUploaderService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WebsiteService } from './website.service';
import { ApiSdkService } from './core/api-sdk.service';
import { ApiSdkMockService } from './core/api-sdk-mock.service';

describe('WebsiteService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      { provide: ApiSdkService, useClass: ApiSdkMockService },
      WebsiteService,
    ]
  }));

  let websiteService: WebsiteService;
  let apiSdk: ApiSdkMockService;

  const unregisteredWebsitesMock = [];

  beforeEach(() => {
    websiteService = TestBed.inject(WebsiteService);
    apiSdk = TestBed.inject(ApiSdkService) as any;
    apiSdk.apiClient.mock(/\/websites\/unregistered/, unregisteredWebsitesMock);
  });

  it('should be created', () => {
    expect(apiSdk).toBeTruthy();
    expect(websiteService).toBeTruthy();
  });

  it('test', (done) => {
    websiteService.listUnregistered('', new Date(), new Date()).subscribe(res => {
      expect(res).toEqual(unregisteredWebsitesMock);
      done();
    });
  });
});

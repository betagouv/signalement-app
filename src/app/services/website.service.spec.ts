import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WebsiteService } from './website.service';
import { ApiSdkService } from './core/api-sdk.service';
import { ApiSdkMockService } from './core/api-sdk-mock.service';
import { ApiWebsiteWithCompany } from '../api-sdk/model/ApiWebsite';
import { HostWithReportCount } from '../model/Website';

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

  const unregisteredWebsitesMock: HostWithReportCount[] = [
    {host: 'www.google.fr', count: 1},
    {host: 'www.something.fr', count: 10},
  ];

  beforeEach(() => {
    websiteService = TestBed.inject(WebsiteService);
    apiSdk = TestBed.inject(ApiSdkService) as any;
    apiSdk.apiClient.mock(/\/websites\/unregistered/, unregisteredWebsitesMock);
  });

  it('should be created', () => {
    expect(apiSdk).toBeTruthy();
    expect(websiteService).toBeTruthy();
  });

  it('should return mocked websites', (done) => {
    websiteService.listUnregistered('', new Date(), new Date()).subscribe(res => {
      expect(res).toEqual(unregisteredWebsitesMock);
      done();
    });
  });
});

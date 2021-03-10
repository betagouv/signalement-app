import { ApiClient, ApiClientApi, ApiClientParams, Method, RequestOption } from './ApiClient';

export interface TestRequest {
  method: Method;
  url: string;
  options?: RequestOption;
  qs?: any;
}

export class ApiClientMock implements ApiClientApi {

  constructor({
    baseUrl,
    headers,
    requestInterceptor,
    mapData,
    mapError,
  }: ApiClientParams) {

    this.fetch = async <T>(method: Method, url: string, options?: RequestOption): Promise<T> => {
      // @ts-ignore bypass private method
      const builtOptions = await ApiClient.buildOptions(options, headers, requestInterceptor);
      const returnValue = this.mocks.find(_ => _.urlPattern.test(url))?.returnValue;
      this.requests.push({
        method,
        url,
        options: builtOptions,
        qs: builtOptions.qs,
      });
      return Promise.resolve(returnValue);
    };
  }

  readonly requests: TestRequest[] = [];

  private readonly mocks: {urlPattern: RegExp, returnValue: any}[] = [];

  readonly mock = (urlPattern: RegExp, returnValue: any) => {
    this.mocks.push({ urlPattern, returnValue });
  };

  private readonly fetch: (method: Method, url: string, options: RequestOption) => Promise<any>;

  readonly get = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.fetch('GET', uri, options);
  };

  readonly post = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.fetch('POST', uri, options);
  };

  readonly delete = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.fetch('DELETE', uri, options);
  };

  readonly put = <T = any>(uri: string, options?: RequestOption): Promise<T> => {
    return this.fetch('PUT', uri, options);
  };
}

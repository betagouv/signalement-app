import { ApiClient, ApiClientApi, ApiClientParams, Method, RequestOption } from './ApiClient';

export interface TestRequest {
  method: Method;
  url: string;
  options?: RequestOption;
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
      const builtOptions = ApiClient.buildOptions(options, headers, requestInterceptor);
      // @ts-ignore bypass private method
      const builtUrl = ApiClient.buildUrl(baseUrl, url, options);

      const returnValue = this.mocks.find(_ => _.urlPattern.test(builtUrl.toString())).returnValue;
      this.requests.push({
        method,
        url: builtUrl.toString(),
        options: builtOptions
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

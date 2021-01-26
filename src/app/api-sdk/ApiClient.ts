import axios, { AxiosError, AxiosResponse } from 'axios';

export interface RequestOption {
  qs?: any;
  headers?: any;
  body?: any;
  timeout?: number;
}

interface ApiClientParams {
  baseUrl: string;
  headers?: any;
  proxy?: string;
  mapData?: (_: any) => any;
  mapError?: (_: any) => never;
}

type StatusCode =
  200 |
  301 |
  302 |
  400 |
  401 |
  403 |
  404 |
  500 |
  504;

export class ApiError extends Error {
  constructor(public code: StatusCode, public message: string, public error?: Error) {
    super(message);
  }
}

export type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';

export class ApiClient {

  constructor({
    baseUrl,
    headers,
    mapData,
    mapError,
  }: ApiClientParams) {
    const client = axios.create({
      baseURL: baseUrl,
      headers: { ...headers, },
    });

    this.fetch = (method: Method, url: string, options?: RequestOption) => {
      return client.request({
        method,
        url,
        headers: options?.headers,
        params: options?.qs,
        data: options?.body,
      }).then(mapData ?? ((_: AxiosResponse) => _.data))
        .catch(mapError ?? ((_: AxiosError) => {
          console.error('[ApiClient] ' + _);
          throw new ApiError(_.response.status as StatusCode, _.response?.data);
        }));
    };
  }

  private readonly fetch: (method: Method, url: string, options?: RequestOption) => Promise<any>;

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

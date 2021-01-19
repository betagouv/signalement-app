import { fetch as fetchPolyfill } from 'whatwg-fetch';

export interface RequestOption {
  qs?: any;
  headers?: any;
  body?: any;
  timeout?: number;
}

export interface ApiClientParams {
  baseUrl: string;
  headers?: any;
  requestInterceptor?: (options?: RequestOption) => Promise<RequestOption> | RequestOption;
  proxy?: string;
  mapData?: (_: any) => any;
  mapError?: (_: any) => never;
}

export interface ApiClientApi {
  readonly get: <T = any>(uri: string, options?: RequestOption) => Promise<T>;
  readonly post: <T = any>(uri: string, options?: RequestOption) => Promise<T>;
  readonly delete: <T = any>(uri: string, options?: RequestOption) => Promise<T>;
  readonly put: <T = any>(uri: string, options?: RequestOption) => Promise<T>;
}

export type StatusCode =
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
    requestInterceptor,
    mapData,
    mapError,
  }: ApiClientParams) {
    const mapResponse = (res: Response) => {
      switch (res.status) {
        case 200:
          return res.json().catch(() => res.text()).catch(() => res);
        default: {
          console.error('[ApiClient]', res);
          throw new ApiError(res.status as StatusCode, res.statusText);
        }
      }
    };
    this.fetch = async (method: Method, url: string, options?: RequestOption) => {
      const builtOptions = ApiClient.buildOptions(options, headers, requestInterceptor);
      const builtUrl = ApiClient.buildUrl(baseUrl, url, options);
      return fetchPolyfill(builtUrl.toString(), {
        method,
        headers: builtOptions.headers,
        body: builtOptions.body,
      }).then(mapResponse)
        .then(mapData ?? (_ => _))
        .catch(mapError ?? Promise.reject.bind(Promise));
    };
  }

  private static readonly buildOptions = (
    options?: RequestOption,
    headers?: any,
    requestInterceptor: (_?: RequestOption) => RequestOption | Promise<RequestOption> = _ => _
  ): RequestOption => {
    const interceptedOptions = requestInterceptor(options);
    return {
      ...interceptedOptions,
      headers: { ...headers, ...options?.headers },
      body: options && JSON.stringify(options.body),
    };
  };

  private static readonly buildUrl = (baseUrl: string, url: string, options?: RequestOption): URL => {
    const urlToFetch = new URL(baseUrl + url);
    Object.keys(options?.qs ?? {})
      .filter(key => options.qs[key])
      .forEach(key => urlToFetch.searchParams.append(key, options.qs[key]));
    return urlToFetch;
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

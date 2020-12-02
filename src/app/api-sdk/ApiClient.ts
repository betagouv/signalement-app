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
    const mapResponse = (_: Response) => {
      switch (_.status) {
        case 200:
          return _.json();
        default: {
          console.error('[ApiClient]', _);
          throw new ApiError(_.status as StatusCode, _.statusText);
        }
      }
    };
    this.fetch = (method: Method, url: string, options?: RequestOption) => {
      return fetch(baseUrl + url, {
        method,
        headers: { ...headers, ...options?.headers },
        body: options && JSON.stringify(options.body),
      }).then(mapResponse)
        .then(mapData ?? (_ => _))
        .catch(mapError ?? Promise.reject.bind(Promise));
    };
  }

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
